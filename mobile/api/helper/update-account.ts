import { api } from '../axios'

type UpdateVisitor = {
  firstname: string;
  lastname: string;
  middle_initial: string;
  email: string | null;
  valid_id_type: string;
  valid_id_photo_url: string;
  photo_url: string | null;
}

type APIResposneType = {
  message?: string;
  error?: string | null;
}

export const updateVisitor = async ({ id, fields }: { id: string; fields: UpdateVisitor }): Promise<APIResposneType | null> => {
  try {
    const response = await api.post('/visitor/me/update', { id, fields: fields });

    if (!response.data) {
      return {
        error: "Cant update user, something went wrong!"
      };
    }
    return {
      error: null,
      ...response.data
    };
  } catch (error) {
    return {
      error: error.response ? error.response.data.error : error.message
    };
  }
}