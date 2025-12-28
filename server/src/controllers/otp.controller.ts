import { Request, Response } from "express";
import db from '@/db/drizzle'
import { visitor, otp } from '@/db/schema'
import { eq, and, gt } from 'drizzle-orm'
import { sendSMSOTP } from '@/sms-api/otp'

type Visitor = typeof visitor.$inferSelect;
type OTP = typeof otp.$inferSelect;

class OTPController {
  async generateVisitorOTP(req: Request, res: Response) {
    try {
      const { phone_number } = req.body;

      const [vst] = await db
        .select({ id: visitor.id, phone_number: visitor.phone_number })
        .from(visitor)
        .where(eq(visitor.phone_number, phone_number));

      if (!vst) {
        return res.status(404).json({ error: 'Visitor not found' });
      }

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

      if (activeOtp) {
        return res.status(200).json({
          message: 'OTP already sent. Please wait 5 minutes before requesting again.'
        });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

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
        
        /* Send SMS OTP via Iprog SMS API */
      await sendSMSOTP(vst.phone_number, code, vst.id);

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

      const [vst] = await db
        .select({ id: visitor.id })
        .from(visitor)
        .where(eq(visitor.phone_number, phone_number));

      if (!vst) {
        return res.status(404).json({ error: 'Visitor not found' });
      }

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


      if (!validOtp) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      await db
        .update(otp)
        .set({ revoked: true })
        .where(eq(otp.id, validOtp.id));

      await db
        .update(visitor)
        .set({ activated: true })
        .where(eq(visitor.id, validOtp.visitor_id));

      return res.status(200).json({
        message: 'Account successfully activated!',
      });

    } catch (error) {
      console.error('[ERROR VERIFY OTP]:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
}

export default new OTPController();