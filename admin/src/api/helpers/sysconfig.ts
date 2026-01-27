import { api } from '../axios';

type ConfigType = {
  tracking_mode: boolean;
  emergency_open: boolean;
  sms_alerts: boolean;
}

type PayloadType = {
  key: 'sms_alerts' | 'tracking_mode' | 'emergency_open';
  value: boolean;
}

export const getConfig = async (): Promise<ConfigType> => {
  try {
    const response = await api.get('/admin/config');
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export const updateConfig = async (payload: PayloadType): Promise<{ message: string; }> => {
  try {
    const response = await api.post('/admin/update-config', {
      [payload.key]: payload.value
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
}