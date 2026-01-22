import { api } from '../axios';

interface Student {
  id: string;
  student_id: string;
  firstname: string;
  lastname: string;
  middle_name: string | null;
  section: string;
  grade_level: string;
  parent_fullname: string;
  parent_phone_number: string;
  rfid_code: string;
  photo_url: string;
  address: string;
  created_at: string;
  enrollment_secret?: string;
};

type Guardian = {
  id: string;
  firstname: string;
  lastname: string;
  middle_name: string;
  phone_number: string;
  address: string;
  rfid_code: string;
  relationship: string;
  photo_url: string;
  created_at: string;
  student_id: string;
}

type StudentWGuardian = Student & {
  guardian: Guardian;
};

export type StudentFields = Partial<Omit<Student, "id" | "created_at">>;

export const createStudent = async (form: StudentFields): Promise<{ success: boolean; message: string; enrollment_secret?: string; }> => {
  try {
    const response = await api.post('/student/create', form);
    console.log("Student created:", response.data);
    return {
      success: true,
      message: response.data.message,
      enrollment_secret: response.data.enrollment_secret
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
    if (error.response?.status === 404) return [];
    throw error
  }
}

export const getStudent = async (id: string): Promise<StudentWGuardian> => {
  const response = await api.get(`/student/get/${id}`);
  return response.data;
}

export const updateStudent = async (id: string, fields: StudentFields): Promise<{ success: boolean; message: string; }> => {
  try {
  const response = await api.post('/student/update', { id, fields });
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

export const deleteStudent = async (id: string): Promise<{ success: boolean; message: string; }> => {
  try {
    const response = await api.delete(`/student/delete/${id}`);

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