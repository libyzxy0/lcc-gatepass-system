import { Request, Response } from "express";
import { sendSMSOTP } from '@/sms-api/otp'
import { sendEmailOTP } from '@/mailer/otp'
import OTPService from '@/services/otp.service'

class OTPController {
  static async generateVisitorOTP(req: Request, res: Response) {
    try {
      const { phone_number } = req.body;
      const { vst, code } = await OTPService.generateVisitorOTP(phone_number);
      
      console.log(vst, code);
        
        /* Send SMS OTP via Iprog SMS API */
      await sendEmailOTP(vst.email, code, vst.id);
      await sendSMSOTP(vst.phone_number, code, vst.id);

      return res.status(200).json({
        message: `OTP sent to ${phone_number}`
      });

    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async verifyVisitorOTP(req: Request, res: Response) {
    try {
      const { phone_number, code } = req.body;

      await OTPService.verifyVisitorOTP(phone_number, code);

      return res.status(200).json({
        message: 'Account successfully activated!',
      });

    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export default OTPController;