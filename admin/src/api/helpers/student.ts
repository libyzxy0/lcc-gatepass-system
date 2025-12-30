import { api } from '../axios';

type Student = {
  id: string;
  student_id: string;
  firstname: string;
  lastname: string;
  middle_name: string | null;
  section: string;
  grade_level: string;
  parent_phone_number: string;
  parent_name: string | null;
  rfid_code: string;
  photo_url: string;
  address: string;
  created_at: string;
};

export type StudentFields = Partial<Omit<Student, "id" | "created_at">>;

export const createStudent = async (form: StudentFields): Promise<{ success: boolean; message: string; }> => {
  try {
  const response = await api.post('/student/create', form);
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

export const getStudents = async (): Promise<Student[]> => {
  try {
  const response = await api.get('/student/all');
  return response.data;
  } catch (error: any) {
    if(error.response?.status === 404) return [];
    throw error
  }
}

export const getStudent = async (id: string): Promise<Student> => {
  const response = await api.post('/student/get', { id });
  return response.data;
}

export const updateStudent = async (id: string, fields: StudentFields): Promise<{ message: string; }> => {
  const response = await api.post('/student/update', { id, fields });
  return response.data;
}

export const deleteStudent = async (id: string): Promise<{ message: string; }> => {
  const response = await api.delete('/student/delete', { params: { id } });
  return response.data;
}