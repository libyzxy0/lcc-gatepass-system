import { api } from '../axios';

interface CheckPhoneNumberType {
  valid: boolean;
  id: string;
  error?: string;
  isServerError: boolean;
}

export const checkNumber = async (phone_number: string): Promise<CheckPhoneNumberType> => {
  try {
    const response = await api.post('/visitor/check-number', { phone_number });
    return {
      valid: true,
      isServerError: false,
      ...response.data
    };

  } catch (error) {
    return {
      id: null,
      valid: false,
      isServerError: error.response?.status !== 404,
      error: error.response ? error.response.data.error : "Something went wrong! hays 🙁"
    };
  }
}