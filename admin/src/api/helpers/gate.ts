import { api } from '../axios';

interface Gate {
  id: string;
  name: string;
  gate_id: string;
  secret: string;
  type: 'entry' | 'exit' | 'entry-exit';
  status: 'online' | 'offline';
  created_at: string;
};

export type GateFields = Partial<Omit<Gate, "id" | "created_at">>;

export const createGate = async (form: GateFields): Promise<{ success: boolean; message: string; }> => {
  try {
    const response = await api.post('/gate/create', form);
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

export const getGates = async (): Promise<Gate[]> => {
  try {
    const response = await api.get('/gate/all');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return [];
    throw error
  }
}

export const getGate = async (id: string): Promise<Gate> => {
  const response = await api.get(`/gate/get/${id}`);
  console.log(response.data)
  return response.data;
}

export const updateGate = async (id: string, fields: GateFields): Promise<{ success: boolean; message: string; }> => {
  try {
  const response = await api.post('/gate/update', { id, fields });
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

export const deleteGate = async (id: string): Promise<{ success: boolean; message: string; }> => {
  try {
    const response = await api.delete(`/gate/delete/${id}`);

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