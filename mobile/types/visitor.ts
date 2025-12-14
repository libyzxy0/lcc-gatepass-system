export interface Visitor {
  id: string;
  visitor_id: string;
  firstname: string;
  lastname: string;
  middle_initial?: string | null;
  email: string;
  phone_number: string;
  verified: boolean;
  activated: boolean;
  valid_id_type?: string | null;
  valid_id_photo_url?: string | null;
  photo_url?: string | null;
  created_at: string;
}
