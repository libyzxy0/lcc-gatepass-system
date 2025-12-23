import { Request, Response } from "express";
import db from '@/db/drizzle'
import { visitor, otp } from '@/db/schema'
import { eq, and, gt } from 'drizzle-orm'
import { sendSMSOTP } from '@/sms-api/otp'

class OTPController {
  async generateVisitorOTP(req: Request, res: Response) {
    try {
      const { phone_number } = req.body;

      const vst = await db
        .select({ id: visitor.id })
        .from(visitor)
        .where(eq(visitor.phone_number, phone_number));

      if (!vst.length) {
        return res.status(404).json({ error: 'Visitor not found' });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const smsotp = await sendSMSOTP(phone_number, code, vst[0].id);

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      const now = new Date();
      await db
        .insert(otp)
        .values({
          user_type: 'visitor',
          visitor_id: vst[0].id,
          code,
          expires_at: expiresAt.toISOString()
        })
        .onConflictDoUpdate({
          target: otp.visitor_id,
          set: {
            code,
            expires_at: expiresAt.toISOString(),
            updated_at: now.toISOString()
          }
        });

      return res.status(200).json({
        message: `OTP sent to ${phone_number}`
      });

    } catch (error) {
      console.error('[ERROR OTP]:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
  async verifyVisitorOTP(req: Request, res: Response) {
    try {
      const { phone_number, code } = req.body;

      const vst = await db
        .select({ id: visitor.id })
        .from(visitor)
        .where(eq(visitor.phone_number, phone_number));

      if (!vst.length) {
        return res.status(404).json({ error: 'Visitor not found' });
      }
      
      const now = new Date();

      const validOtp = await db
        .select()
        .from(otp)
        .where(
          and(
            eq(otp.visitor_id, vst[0].id),
            eq(otp.code, code),
            gt(otp.expires_at, now.toISOString())
          )
        );

      if (!validOtp.length) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      await db
        .update(otp)
        .set({ revoked: true })
        .where(eq(otp.id, validOtp[0].id));

      await db
        .update(visitor)
        .set({ activated: true })
        .where(eq(visitor.id, validOtp[0].visitor_id));

      return res.status(200).json({
        message: 'OTP verified successfully',
      });

    } catch (error) {
      console.error('[ERROR VERIFY OTP]:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
}

export default new OTPController();