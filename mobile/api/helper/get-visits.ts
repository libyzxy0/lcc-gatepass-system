import { api } from '../axios'

type Visits = {
  id: string;
  visitor_id: string;
  purpose: string;
  description: string;
  visiting: string;
  schedule_date: string;
  secured: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export const getVisits = async (): Promise<Visits | null> => {
  try {
    const response = await api.get('/visitor/me/visits');
    if (!response.data) return null;
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}