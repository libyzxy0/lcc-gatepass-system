import { api } from '@/api/axios'

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
  reject_reason: string | null;
  created_at: string;
};

interface DeleteVisitResponse {
  success: boolean;
  message: string;
}

interface IVehicle {
  type: 'motorcycle' | 'tricycle' | 'car';
  plate_number: string;
}

interface IRequestGatepass {
  student_pass_secret?: string | null;
  purpose: string;
  description: string;
  schedule_date: string;
  vehicle: IVehicle | null;
}

interface APIResposneType {
  message?: string;
  error?: string | null;
}

export const requestGatepass = async ({ student_pass_secret, purpose, description, schedule_date, vehicle }: IRequestGatepass): Promise<APIResposneType | null> => {
  try {
    const response = await api.post('/gatepass/request-gatepass', {
      student_pass_secret: student_pass_secret ?? null,
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

export const getGatepass = async (): Promise<Gatepass[]> => {
  try {
    const response = await api.get('/gatepass');
    if (!response.data) return [];
    return response.data;
  } catch (error) {
   // console.error(error.response ? error.response.data.error : error.message);
    return [];
  }
}

export const deleteGatepass = async (visitId: string): Promise<DeleteVisitResponse> => {
  try {
    const response = await api.delete('/gatepass/delete-gatepass/' + visitId);
    if (!response.data) return {
      success: false,
      message: "Can't delete gatepass, Someting went wrong!"
    };
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    //console.error(error.response ? error.response.data.error : error.message);
    return {
      success: false,
      message: error.response ? error.response.data.error : error.message
    };
  }
}