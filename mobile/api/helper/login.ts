import { api } from '../axios'
import { normalize } from '@/utils/format-ph-number'

export const visitorLogin = async (phone_number: string, pin: string): Promise<{ access_token: boolean; } | null> => {
  const response = await api.post('/visitor/login', { phone_number: normalize(phone_number), pin });
  if (!response.data) return null;
  return {
    access_token: response.data.access_token
  };
}