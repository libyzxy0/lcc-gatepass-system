import { api } from '../axios'

export const checkNumber = async (phone_number: string): Promise<{success: boolean; error?: string; }> => {
  try {
    const response = await api.post('/visitor/check-number', { phone_number });
    
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error : "Something went wrong! hays 🙁"
    };
  }
}