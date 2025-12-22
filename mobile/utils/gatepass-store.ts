import { create } from 'zustand'
import { getGatepass } from '@/api/helper/gatepass';

export const useGatepassStore = create((set) => ({
  gatepass: [],
  fetching: true,
  fetchGatepass: async (showLoading?: boolean) => {
    try {
      set((state) => ({ ...state, fetching: showLoading ?? false }))
      const allGatepass = await getGatepass();
      set((state) => ({ ...state, gatepass: allGatepass }))
    } catch (error) {
      console.error(error)
    } finally {
      set((state) => ({ ...state, fetching: false }))
    }
  },
}))