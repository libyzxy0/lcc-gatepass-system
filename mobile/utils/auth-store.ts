import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";
import { visitorLogin } from '@/api/helper/login'
import { getVisitorSession } from '@/api/helper/get-session'

type Visitor = {
  id: string;
  firstname: string;
  lastname: string;
  middle_initial: string;
  email: string | null;
  phone_number: string;
  valid_id_type: string;
  valid_id_photo_url: string;
  photo_url: string | null;
  created_at: string;
  verified: boolean;
  activated: boolean;
}

type AuthState = {
  isLoggedIn: boolean;
  visitor: Visitor;
  accessToken: string;
  phoneNumber: string;
  login: (phone: string, pin: string) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      isLoggedIn: false,
      accessToken: null,
      phoneNumber: null,
      login: async (pin: string) => {
        const loginData = await visitorLogin(get().phoneNumber, pin);

        if (!loginData) {
          throw new Error("Failed to login, something went wrong!");
        }

        set(state => {
          return {
            ...state,
            isLoggedIn: true,
            accessToken: loginData.access_token
          };
        })
        await get().getSession();
      },
      logout: () => {
        console.log("Logging out!");
        set(state => {
          return {
            ...state,
            isLoggedIn: false,
            visitor: null,
            accessToken: null
          };
        });
      },
      setPhoneNumber: (phone_number: string | null) => {
        set(state => ({
          ...state,
          phoneNumber: phone_number
        }));
      },
      getSession: async () => {
        const session = await getVisitorSession();
        if (session) {
          set(state => {
            return {
              ...state,
              visitor: session
            };
          });
        } else {
          set(state => {
            return {
              ...state,
              visitor: null
            };
          });
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => ({
        setItem,
        getItem,
        removeItem: deleteItemAsync
      })),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['accessToken', 'visitor', 'isLoggedIn'].includes(key))
        ),
    }
  )
);
