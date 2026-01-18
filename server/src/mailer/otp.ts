import { SMTP_USER } from '@/secrets'
import { transporter } from '@/mailer/nodemailer'

export const sendEmailOTP = async (email: string, otp: string, account_id) => {
  try {
    const info = await transporter.sendMail({
      from: `La Concepcion College Digital Gatepass System <${SMTP_USER}>`,
      to: email,
      subject: `Activate your LCC GPASS Account`,
      text: `Your LCC-DGS One Time Password is: ${otp}. Never share this OTP with anyone!`,
      html: `
      <!DOCTYPE html>
      <html>
  <body style="margin:0; padding:0; background:#f4f8ff; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8ff; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #d3e3ff; border-radius:6px; padding:20px;">
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <img src="https://i.ibb.co/x8RXpwgM/1000069617-removebg-preview.png" alt="Logo" width="200" style="display:block;">
              </td>
            </tr>
            <tr>
              <td style="text-align:center; font-size:22px; font-weight:bold; color:#1a56db; padding-bottom:10px;">
                Your One-Time Password
              </td>
            </tr>
            <tr>
              <td style="font-size:15px; color:#333333; text-align:center; padding:10px 20px;">
                Use the OTP below to activate your LCC GPASS visitor account.  
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 0;">
                <div style="font-size:32px; font-weight:bold; color:#1a56db; padding:15px 25px; border:2px dashed #1a56db; border-radius:6px; display:inline-block;letter-spacing: 5px;">
                  ${otp}
                </div>
              </td>
            </tr>
            <tr>
              <td style="font-size:14px; color:#555; text-align:center; padding:0 30px 20px;">
                This code will expire in 5 minutes. If you didn’t request this, you can safely ignore this email.
              </td>
            </tr>
            <tr>
              <td style="text-align:center; font-size:12px; color:#888; padding-top:20px; border-top:1px solid #e1e8ff;">
                © 2026 La Concepcion College Digital Gatepass System. All rights reserved.<br>
                This is an automated email — please do not reply.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
    });
    return info;
  } catch (error) {
    throw error;
  }
}

(async () => {
  const data = await sendEmailOTP('janlibydelacosta@gmail.com', '654321', 'idkotangina');
  console.log(data);
})()
