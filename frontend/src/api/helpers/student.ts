import { api } from '../axios';

type Student = {
  id: string;
  student_id: string;
  firstname: string;
  lastname: string;
  middle_initial: string | null;
  section: string;
  grade_level: string;
  parent_phone_number: string;
  parent_email: string | null;
  rfid_code: string;
  photo_url: string;
  created_at: string;
};

export type StudentUpdateFields = Partial<Omit<Student, "id" | "created_at">>;

export const createStudent = async (): Promise<{ message: string; }> => {
  const response = await api.get('/student/create-student');
  return response.data;
}

export const getStudents = async (): Promise<Student[]> => {
  const response = await api.get('/student/get-students');
  return response.data;
}

export const getStudent = async (id: string): Promise<Student> => {
  const response = await api.post('/student/get-student', { id });
  return response.data;
}

export const updateStudent = async (id: string, fields: StudentUpdateFields): Promise<{ message: string; }> => {
  const response = await api.post('/student/update-student', { id, fields });
  return response.data;
}

export const deleteStudent = async (id: string): Promise<{ message: string; }> => {
  const response = await api.delete('/student/delete-student', { params: { id } });
  return response.data;
}