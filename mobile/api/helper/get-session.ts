import { api } from '../axios'
import { Alert } from 'react-native'

type Visitor = {
  id: string;
  firstname: string;
  lastname: string;
  middle_initial: string;
  email: string | null;
  phone_number: string;
  valid_id_type: string;
  valid_id_photo_url: string;
  photo_url: string | null;
  created_at: string;
  verified: boolean;
  activated: boolean;
}

export const getVisitorSession = async (): Promise<Visitor | null> => {
  try {
    const response = await api.get('/visitor/get-session');
    if (!response.data) return null;
    return response.data;
  } catch (error) {
    return null;
  }
}