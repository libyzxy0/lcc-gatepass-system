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
        phone_number
      });
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      status: error.response ? error.response.status : 500,
      message: error.message,
      message_id: null
    }
  }
}