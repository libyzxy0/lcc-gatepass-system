import { api } from '../axios';

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

export const getAllVisitors = async (): Promise<Visitor[]> => {
  try {
    const response = await api.get('/visitor/all');
    return response.data;
  } catch (error: any) {
    if (error.status === 404) return [];
    throw error;
  }
}

export const getVisitor = async (id: string): Promise<Visitor> => {
    const response = await api.get(`/visitor/get/${id}`);
    return response.data;
}

export const deleteVisitor = async (id: string): Promise<{ success: boolean; message: string; }> => {
  try {
    const response = await api.delete(`/visitor/delete/${id}`);

    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response ? error.response.data.error : error.message
    }
  }
}

export const approve = async (id: string) => {
  try {
    const response = await api.post('/visitor/approve', { id });
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
    const response = await api.post('/visitor/reject', { id, reason });
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