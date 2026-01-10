import { api } from '../axios';

type APIResVisitors = {
  id: string;
  visitor_id: string;
  firstname: string;
  lastname: string;
  middle_initial: string;
  address: string;
  email: string;
  phone_number: string;
  verified: boolean;
  activated: boolean;
  valid_id_type: string;
  valid_id_photo_url: string;
  photo_url: string;
  created_at: string;
}

export const getAllVisitors = async (): Promise<APIResVisitors[]> => {
  try {
    const response = await api.get('/visitor/all');
    return response.data;
  } catch (error: any) {
    if (error.status === 404) return [];
    throw error;
  }
}