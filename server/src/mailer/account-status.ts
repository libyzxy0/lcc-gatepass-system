import { SMTP_USER } from '@/secrets'
import { transporter } from '@/mailer/nodemailer';

type MailGatepassStatusType = {
  email: string;
  status: 'approve' | 'reject';
  reason?: string | null;
}

const labels = {
  approve: 'Congratulations Your account is now Verified 🎉',
  reject: "Sorry, we can't verify your Account 😥"
}
const short_labels = {
  approve: 'Account Verified',
  reject: "Verification Failed"
}

const colors = {
  approve: '#1adb60',
  reject: '#db561a'
}

export const sendAccountStatus = async ({
  email,
  status,
  reason
}: MailGatepassStatusType) => {
  try {
    const note = {
      approve: 'Your account is verified 🎉 You can now create gatepasses without waiting for admin approvals.',
      reject: `Your account verification has been rejected 😥 Reason: ${reason}`,
    }
    const info = await transporter.sendMail({
      from: `La Concepcion College Digital Gatepass System <${SMTP_USER}>`,
      to: email,
      subject: `${labels[status]}`,
      text: `${labels[status]}`,
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
              <td style="text-align:center; font-size:22px; font-weight:bold; color: ${colors[status]}; padding-bottom:10px;">
               ${labels[status]}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 0;">
                <div style="font-size:32px; font-weight:bold; color:${colors[status]}; padding:15px 25px; border:2px dashed ${colors[status]}a7; border-radius:6px; display:inline-block;background-color: ${colors[status]}19;">
                  ${short_labels[status]}
                </div>
              </td>
            </tr>
            <tr>
              <td style="font-size:14px; color:#555; text-align:center; padding:0 30px 20px;">
                ${note[status]}
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
      `
    })
    return info;
  } catch (error) {
    console.error(error);
  }
}


/*
(async () => {
  const data = await sendAccountStatus({
    email: 'janlibydelacosta@gmail.com',
    status: 'reject',
    reason: 'We cant verify your valid id, please submit another!'
  })
  console.log(data);
})();
*/