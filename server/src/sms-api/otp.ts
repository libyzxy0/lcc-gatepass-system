import { SmsAPI } from './api'
import { SMS_ENABLED } from '@/configuration'
import { tg_api } from './tgapi'

export const sendSMSOTP = async (phone_number: string, otp: string) => {
  const otp_msg = `Your LCC GPass OTP is: ${otp}\n\nNever share it with anyone! Use this to activate your LCC GPass Account.`
  if(SMS_ENABLED) {
    const data = await SmsAPI(phone_number, otp_msg);
    return data;
  } else {
    const data = await tg_api(otp_msg);
    return data;
  }
}