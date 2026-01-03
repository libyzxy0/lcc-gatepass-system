export type CreateStudentType = {
  student_id: string;
  firstname: string;
  lastname: string;
  middle_name: string;
  section: string;
  grade_level: string;
  parent_name: string;
  parent_phone_number: string;
  address: string;
  rfid_code: string;
  photo_url?: string;
}