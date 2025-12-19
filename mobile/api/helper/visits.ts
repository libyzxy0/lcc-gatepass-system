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

interface CreateVisit {
  purpose: string;
  description: string;
  visiting: string;
  date: string;
  secured: boolean;
}

interface APIResposneType {
  message?: string;
  error?: string | null;
}

export const createVisit = async ({ purpose, description, visiting, date, secured }: CreateVisit): Promise<APIResposneType | null> => {
  try {
    const response = await api.post('/visitor/me/create-visit', {
      purpose,
      description,
      visiting,
      date,
      secured
    });

    if (!response.data) {
      return {
        error: "Cant create visit, something went wrong!"
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

export const getVisits = async (): Promise<Visits | null> => {
  try {
    const response = await api.get('/visitor/me/visits');
    if (!response.data) return null;
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const deleteVisit = async (visitId: string): Promise<DeleteVisitResponse> => {
  try {
    const response = await api.delete('/visitor/me/delete-visit/' + visitId);
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