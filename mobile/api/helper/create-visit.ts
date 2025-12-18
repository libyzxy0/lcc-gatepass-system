import { api } from '../axios'

type CreateVisit = {
  purpose: string;
  description: string;
  visiting: string;
  date: string;
  secured: boolean;
}

type APIResposneType = {
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