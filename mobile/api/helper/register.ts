import { api } from '../axios'
import { Alert } from 'react-native'

type VisitorRegType = {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  pin: string;
}

type APIResponseType = {
  success: boolean;
  message: string;
}

export const visitorRegister = async ({
  firstname,
  lastname,
  email,
  phone_number,
  pin
}: VisitorRegType): Promise<APIResponseType | null> => {
  try {
    const response = await api.post('/visitor/new', {
      firstname,
      lastname,
      email,
      phone_number,
      pin
    });
    if (!response.data) return {
      success: false,
      message: "[ERR2007]: Something went wrong!"
    };;
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error("Error visitor registration:", error.message);
    return {
      success: false,
      message: error.response ? error.response.error : error.message
    }
  }
}