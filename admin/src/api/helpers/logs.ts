import { api } from '../axios';

type Log = {
  id: string;
  type: 'student' | 'visitor' | 'staff' | 'guardian';
  log_id: string;
  name: string;
  time_in: string;
  time_out: string;
  entity_id: string;
  device_id: string;
  entry_type: 'qr' | 'rfid';
  created_at: string;
};

export const getAllLogs = async (): Promise<Log[]> => {
  try {
    const response = await api.get('/logs/all');
    return response.data;
  } catch (error: any) {
    if (error.status === 404) return [];
    throw error;
  }
}

export const getLog = async (id: string): Promise<Log> => {
    const response = await api.get(`/logs/get/${id}`);
    return response.data;
}

export const deleteLog = async (id: string): Promise<{ success: boolean; message: string; }> => {
  try {
    const response = await api.delete(`/logs/delete/${id}`);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response ? error.response.data.error : error.message
    };
  }
}