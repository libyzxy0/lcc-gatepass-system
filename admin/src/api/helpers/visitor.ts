import { api } from '../axios';

type Visitor = {
  id: string;
  visitor_id: string;
  firstname: string;
  lastname: string;
  middle_initial: string | null;
  phone_number: string;
  email: string | null;
  photo_url: string;
  created_at: string;
  verified: boolean;
  activated: boolean;
  pin: string;
  valid_id_type: string;
  valid_id_photo_url: string;
};

export type StudentUpdateFields = Partial<Omit<Visitor, "id" | "created_at">>;

export const createVisitor = async (): Promise<{ message: string; }> => {
  const response = await api.get('/visitor/new');
  return response.data;
}

export const getVisitors = async (): Promise<Visitor[]> => {
  const response = await api.get('/visitor/get-visitors');
  return response.data;
}

export const getVisitor = async (id: string): Promise<Visitor> => {
  const response = await api.post('/visitor/get-visitor', { id });
  return response.data;
}

export const updateVisitor = async (id: string, fields: StudentUpdateFields): Promise<{ message: string; }> => {
  const response = await api.post('/visitor/update-visitor', { id, fields });
  return response.data;
}

export const deleteVisitor = async (id: string): Promise<{ message: string; }> => {
  const response = await api.delete('/visitor/delete-visitor', { params: { id } });
  return response.data;
}