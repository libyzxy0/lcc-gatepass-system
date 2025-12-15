import { api } from '../axios'
import { normalize } from '@/utils/format-ph-number'

export const generateOTP = async (phone_number: string): Promise<{ success: boolean; message: string; server_error?: boolean; } | null> => {
  try {
    const response = await api.post('/otp/vst/new', { phone_number: normalize(phone_number) });
    if (!response.data) {
      return {
        success: false,
        message: "Something went wrong!"
      };
    };

    return {
      success: true,
      message: response.data.message
    };

  } catch (error) {
    return {
      success: false,
      server_error: error.response.status === 500,
      message: error.response ? error.response.data.error : error.message
    }
  }
}

export const verifyOTP = async (phone_number: string, otp: string): Promise<{ verified: boolean; message: string; server_error?: boolean } | null> => {
  try {
    const response = await api.post('/otp/vst/chk', { phone_number: normalize(phone_number), code: otp });
    if (!response.data) {
      return {
        verified: false,
        message: "Something went wrong!"
      }
    }
    return {
      verified: true,
      message: response.data.message
    };
  } catch (error) {
    return {
      verified: false,
      server_error: error.response.status === 500,
      message: error.response ? error.response.data.error : error.message
    }
  }
}