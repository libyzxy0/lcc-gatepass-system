import { create } from "zustand";
import { api } from "@/api/axios";

type Admin = {
  id: string;
  firstname: string;
  lastname: string;
  role: 'admin' | 'staff';
  email: string;
  phone_number: string;
  password: string;
  is_super_admin: boolean;
  created_at: string;
};

type AuthState = {
  admin: Admin | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  setAccessToken: () => void;
  getSession: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  admin: null,
  accessToken: null,
  isAuthenticated: false,

  setAccessToken: (token: string) => set({ accessToken: token }),

  login: async (email: string, password: string) => {
    try {
      const { data } = await api.post("/admin/login", { email, password });
      set({ accessToken: data.access_token });
      await get().getSession();
    } catch (err) {
      console.error("Session fetch failed after login:", err);
      get().logout();
    }
  },
  getSession: async () => {
    try {
      const { data: refreshData } = await api.post("/admin/refresh");
      set({ accessToken: refreshData.access_token });

      const { data } = await api.get("/admin/session", {
        headers: { Authorization: `Bearer ${get().accessToken}` },
      });
      set({ admin: data, isAuthenticated: true });
    } catch {
      set({ admin: null, accessToken: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    try { await api.post("/admin/logout"); } catch (error) {
      console.error("Failed to logout:", error);
    }
    set({ admin: null, accessToken: null, isAuthenticated: false });
  },
}));
