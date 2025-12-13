import { api } from '../axios'
import { Alert } from 'react-native'

type VisitorRegType = {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  pin: string;
}

type APIResDataType = {
  success: boolean;
  phone_number: string;
}
type APIResponseType = {
  success: boolean;
  data: APIResDataType;
}

export const visitorRegister = async ({
  firstname,
  lastname,
  email,
  phone_number,
  pin
}: VisitorRegType): Promise<APIResponseType | null> => {
  const response = await api.post('/visitor/new', {
    firstname,
    lastname,
    email,
    phone_number,
    pin
  });
  console.warn(response.data);
  if (!response.data) return null;
  return response.data;
}