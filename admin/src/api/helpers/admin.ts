import { api } from '../axios';

interface Admin {
  id: string;
  name: string;
  role: string;
  email: string;
  phone_number: string;
  photo_url: string;
  is_super_admin: boolean;
  created_at: string;
};

export type AdminFields = Partial<Omit<Admin, "id" | "created_at">>;

export const createAdmin = async (form: AdminFields): Promise<{ success: boolean; message: string; }> => {
  try {
    const response = await api.post('/admin/create', form);
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

export const getAdmins = async (): Promise<Admin[]> => {
  try {
    const response = await api.get('/admin/all');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return [];
    throw error
  }
}

export const getAdmin = async (id: string): Promise<Admin> => {
  const response = await api.get(`/admin/get/${id}`);
  console.log(response.data)
  return response.data;
}

export const updateAdmin = async (id: string, fields: AdminFields): Promise<{ success: boolean; message: string; }> => {
  try {
  const response = await api.post('/admin/update', { id, fields });
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

export const deleteAdmin = async (id: string): Promise<{ success: boolean; message: string; }> => {
  try {
    const response = await api.delete(`/admin/delete/${id}`);

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