export type CreateStudentType = {
  student_id: string;
  firstname: string;
  lastname: string;
  middle_name: string;
  section: string;
  grade_level: string;
  address: string;
  rfid_code: string;
  photo_url?: string;
  guardian_photo_url?: string;
  guardian_phone_number: string;
  guardian_firstname: string;
  guardian_lastname: string;
  guardian_middle_name: string;
  guardian_rfid_code: string;
  relationship: string;
}