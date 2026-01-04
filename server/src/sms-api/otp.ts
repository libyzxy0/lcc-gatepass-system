import { SmsAPI } from './api'
import { SMS_ENABLED } from '@/configuration'
import { tg_api } from './tgapi'

export const sendSMSOTP = async (phone_number: string, otp: string, account_id) => {
  const otp_msg = `Your LCC GPASS One Time Password (OTP) is ${otp}\n\nNever share it with anyone! Use this to activate your LCC GPASS Account.`;
  
  if(SMS_ENABLED) {
    const data = await SmsAPI(phone_number, otp_msg);
    
    tg_api(encodeURIComponent(`<b>VISITOR OTP</b>\n[Debug Notification]\n\n<b>IProgSms</b>: ${data?.message}\n<b>Phone</b>: ${phone_number}\n<b>Account Id</b>: ${account_id}\n<b>Code</b>: ${otp}\n\n<i>Received from Server (LCC Gatepass Server)</i>`));
    
    if(data.status === 200) return data;
  } else {
    const data = await tg_api(otp_msg);
    return data;
  }
}