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
  try {
  const response = await api.get('/gatepass/all');
  return response.data;
  } catch (error: any) {
    if(error.status === 404) return [];
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
      success: false,
      error: error.response ? error.response.data.error : 'An error occurred'
    }
  }
}

export const reject = async (id: string) => {
  try {
    const response = await api.post('/gatepass/reject', { id });
    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response ? error.response.data.error : 'An error occurred'
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
      error: error.response ? error.response.data.error : 'An error occurred'
    }
  }
}