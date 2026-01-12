import { api } from '../axios';

type OverviewCountsType = {
  students: number;
  pending_gatepass: number;
  other_people: number;
  students_today: number;
  visitors_today: number;
  people_today: number;
}

export const getOverviewCounts = async (): Promise<OverviewCountsType> => {
  try {
    const response = await api.get(`/admin/overview/counts`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return {
      students: 0,
      pending_gatepass: 0,
      other_people: 0,
      students_today: 0,
      visitors_today: 0,
      people_today: 0
    }
    throw error;
  }
}
