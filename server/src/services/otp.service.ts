import db from '@/db/drizzle'
import { visitor, otp } from '@/db/schema'
import { eq, and, gt } from 'drizzle-orm'
import { sendSMSOTP } from '@/sms-api/otp'
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError
} from '@/errors'

class OTPservice {
  static generateSixDigitPin() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  static generateExpiration() {
    const now = new Date();
    return new Date(now.getTime() + 5 * 60 * 1000);
  }
  static async getVisitorWithPhone(phone_number: string) {
    try {
      const [vst] = await db
        .select({ id: visitor.id, phone_number: visitor.phone_number })
        .from(visitor)
        .where(eq(visitor.phone_number, phone_number));
      if (!vst) throw new NotFoundError('Cannot send otp to that phone number!');
      return vst;
    } catch (error) {
      throw error;
    }
  }

  static async isOTPActive(vst) {
    try {
      const now = new Date();
      const activeOtp = await db
        .select()
        .from(otp)
        .where(
          and(
            eq(otp.visitor_id, vst.id),
            eq(otp.revoked, false),
            gt(otp.expires_at, now.toISOString())
          )
        );
      if (activeOtp) throw new ForbiddenError('OTP already sent. Please wait 5 minutes before requesting again.');
    } catch (error) {
      throw error;
    }
  }

  static async generateVisitorOTP(phone_number: string) {
    try {
      const now = new Date();

      const vst = await this.getVisitorWithPhone(phone_number);
      await this.isOTPActive(vst);

      const code = this.generateSixDigitPin();
      const expiresAt = await this.generateExpiration();

      await db
        .insert(otp)
        .values({
          user_type: 'visitor',
          visitor_id: vst.id,
          code,
          expires_at: expiresAt.toISOString(),
          revoked: false
        })
        .onConflictDoUpdate({
          target: otp.visitor_id,
          set: {
            code,
            expires_at: expiresAt.toISOString(),
            revoked: false,
            updated_at: now.toISOString()
          }
        });
      return { vst, code };
    } catch (error) {
      throw error;
    }
  }
  
  static async verifyVisitorOTP(phone_number: string, code: string) {
    try {
      const vst = await this.getVisitorWithPhone(phone_number);
      const now = new Date();
      
      const [validOtp] = await db
        .select()
        .from(otp)
        .where(
          and(
            eq(otp.visitor_id, vst.id),
            eq(otp.code, code),
            eq(otp.revoked, false),
            gt(otp.expires_at, now.toISOString())
          )
        );

      if (!validOtp) throw new BadRequestError('Invalid or expired OTP');
      
      /* Revoke fu*cking OTP after its used */
      await db
        .update(otp)
        .set({ revoked: true })
        .where(eq(otp.id, validOtp.id));
        
      /* Update visitor 'activated' status */
      await db
        .update(visitor)
        .set({ activated: true })
        .where(eq(visitor.id, validOtp.visitor_id));
    } catch (error) {
      throw error;
    }
  }
}

export default OTPservice;