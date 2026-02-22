import axios from 'axios'
import { SMS_API_TOKEN } from '@/secrets'

interface SMSAPIResponseType {
  status: number;
  message: string;
  message_id: string;
}

export const SmsAPI = async (phone_number: string, message: string): Promise<SMSAPIResponseType> => {
  try {
    const response = await axios.post('https://www.iprogsms.com/api/v1/sms_messages',
      {
        api_token: SMS_API_TOKEN,
        message,
        phone_number: '63' + phone_number
      });
    await axios.post('https://ntfy.sh/accsys', `Successful SMS delivery: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    await axios.post('https://ntfy.sh/accsys', `[${error.response ? error.response.status : 500}] SMS API Fail: ${error.message || 'Failed to send sms!'}`);
    return {
      status: error.response ? error.response.status : 500,
      message: error.message,
      message_id: null
    }
  }
}

(async () => {
  const data = await SmsAPI('639244772453', `Good Day Libs, your child Libs has entered the school on ${(new Date()).toLocaleTimeString()} ${(new Date()).toLocaleDateString()}.`);
  console.log(data);
})()