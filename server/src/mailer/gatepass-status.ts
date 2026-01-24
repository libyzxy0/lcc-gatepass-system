import { SMTP_USER } from '@/secrets'
import { transporter } from '@/mailer/nodemailer';

type MailGatepassStatusType = {
  email: string;
  status: 'approve' | 'reject' | 'expire';
  purpose: string;
  description: string;
  reason?: string | null;
}

const labels = {
  approve: 'Approved',
  reject: 'Rejected',
  expire: 'Expired',
}

const emojis = {
  approve: '🎉',
  reject: '☹️',
  expire: '⏱️',
}

const colors = {
  approve: '#1adb60',
  reject: '#db561a',
  expire: '#db1a1a',
}

export const sendGatepassStatus = async ({
  email,
  status,
  purpose,
  description,
  reason
}: MailGatepassStatusType) => {
  try {
    const note = {
      approve: 'You can now use your QRCode gatepass to enter or exit within La Concepcion College premises.',
      reject: `Sorry, we can't approve your gatepass request for now. Reason: ${reason}`,
      expire: "Your gatepass has been expired, you are not able to use this now to enter or exit within La Concepcion College premises."
    }
    const info = await transporter.sendMail({
      from: `La Concepcion College Digital Gatepass System <${SMTP_USER}>`,
      to: email,
      subject: `Your gatepass requests has been ${labels[status]}`,
      text: `Your gatepass requests has been ${labels[status]} ${emojis[status]}`,
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
                Your Gatepass Request is ${labels[status]} ${emojis[status]}
              </td>
            </tr>
            <tr>
              <td style="font-size:22px; color:#333333; text-align:center; padding:10px 20px;">
                ${purpose}
              </td>
            </tr>
            <tr>
              <td style="font-size:15px; color:#333333; text-align:center; padding:10px 20px;">
                “${description}”
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 0;">
                <div style="font-size:32px; font-weight:bold; color:${colors[status]}; padding:15px 25px; border:2px dashed ${colors[status]}a7; border-radius:6px; display:inline-block;background-color: ${colors[status]}19;">
                  ${labels[status]}
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
  const data = await sendGatepassStatus({
    email: 'dacallosaieshajadenj@gmail.com',
    status: 'approve',
    purpose: 'Testing Gatepass',
    description: `The future belongs to those who believe in the beauty of their dreams... Fall in love with your dream. — Eleanor Roosevelt`
  })
  console.log(data);
})();
*/