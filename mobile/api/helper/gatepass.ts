import { api } from '@/api/axios'

interface Visits {
  id: string;
  visitor_id: string;
  purpose: string;
  description: string;
  visiting: string;
  schedule_date: string;
  secured: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

interface DeleteVisitResponse {
  success: boolean;
  message: string;
}

interface IVehicle {
  type: 'motorcycle' | 'tricycle' | 'car';
  plate_number: string;
}

interface IRequestGatepass {
  purpose: string;
  description: string;
  schedule_date: string;
  vehicle: IVehicle | null;
}

interface APIResposneType {
  message?: string;
  error?: string | null;
}

export const requestGatepass = async ({ purpose, description, schedule_date, vehicle }: IRequestGatepass): Promise<APIResposneType | null> => {
  try {
    const response = await api.post('/visitor/me/request-gatepass', {
      purpose,
      description,
      schedule_date,
      vehicle
    });

    if (!response.data) {
      return {
        error: "Cant request gatepass, something went wrong!"
      };
    }
    return {
      error: null,
      message: response.data?.message
    };
  } catch (error) {
    return {
      error: error.response ? error.response.data.error : error.message
    };
  }
}

export const getGatepass = async (): Promise<Visits[]> => {
  try {
    const response = await api.get('/visitor/me/gatepass');
    if (!response.data) return [];
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const deleteGatepass = async (visitId: string): Promise<DeleteVisitResponse> => {
  try {
    const response = await api.delete('/visitor/me/delete-gatepass/' + visitId);
    if (!response.data) return {
      success: false,
      message: 'Someting went wrong!'
    };
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.response ? error.response.data.error : error.message
    };
  }
}