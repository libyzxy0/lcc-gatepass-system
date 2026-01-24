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

export type Visitor = {
  id: string;
  visitor_id: string;
  firstname: string;
  lastname: string;
  middle_name: string;
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

type GatepassGetType = {
  gatepass: Gatepass;
  visitor: Visitor;
}

export const getAllGatepass = async (): Promise<APIResGatepass[]> => {
  try {
  const response = await api.get('/gatepass/all');
  return response.data;
  } catch (error: any) {
    if(error.status === 404) return [];
    throw error;
  }
}

export const getGatepass = async (id: string): Promise<GatepassGetType> => {
  try {
  const response = await api.get(`/gatepass/get/${id}`);
  console.log(response.data)
  return response.data;
  } catch (error: any) {
    throw error;
  }
}

export const approve = async (id: string) => {
  try {
    const response = await api.post('/gatepass/approve', { id });
    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      message: false,
      error: error.response ? error.response.data.error : 'An error occurred'
    }
  }
}

export const reject = async (id: string, reason: string | null) => {
  try {
    const response = await api.post('/gatepass/reject', { id, reason });
    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response ? error.response.data.error : 'An error occurred'
    }
  }
}

export const deletePass = async (id: string) => {
  try {
    const response = await api.delete(`/gatepass/delete/${id}`);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response ? error.response.data.error : 'An error occurred'
    }
  }
}