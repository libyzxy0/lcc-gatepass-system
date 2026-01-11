import { api } from '../axios';

interface Staff {
  id: string;
  staff_id: string;
  firstname: string;
  lastname: string;
  middle_name: string | null;
  phone_number: string;
  rfid_code: string;
  staff_type: string;
  photo_url: string | null;
  email: string;
  created_at: string;
};

export type StaffFields = Partial<Omit<Staff, "id" | "created_at">>;

export const createStaff = async (form: StaffFields): Promise<{ success: boolean; message: string; }> => {
  try {
    const response = await api.post('/staff/create', form);
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

export const getStaffs = async (): Promise<Staff[]> => {
  try {
    const response = await api.get('/staff/all');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return [];
    throw error
  }
}

export const getStaff = async (id: string): Promise<Staff> => {
  const response = await api.get(`/staff/get/${id}`);
  console.log(response.data)
  return response.data;
}

export const updateStaff = async (id: string, fields: StaffFields): Promise<{ success: boolean; message: string; }> => {
  try {
  const response = await api.post('/staff/update', { id, fields });
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

export const deleteStaff = async (id: string): Promise<{ success: boolean; message: string; }> => {
  try {
    const response = await api.delete(`/staff/delete/${id}`);

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