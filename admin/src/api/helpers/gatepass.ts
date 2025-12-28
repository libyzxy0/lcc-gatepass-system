import { api } from '../axios';

type Gatepass = {
  id: string;
  visitor_id: string;
  purpose: string;
  description: string;
  vehicle_type: string | null;
  vehicle_plate: string | null;
  qr_token: string;
  schedule_date: string;
  status: 'approved' | 'pending' | 'expired' | 'rejected';
  created_at: string;
};

type APIResGatepass = Gatepass & {
  visitor_fullname: string;
  visitor_lastname: string;
  visitor_firstname: string;
}

export const getAllGatepass = async (): Promise<APIResGatepass[]> => {
  const response = await api.get('/gatepass/all');
  return response.data;
}