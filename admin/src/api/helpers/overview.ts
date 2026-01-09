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
  const response = await api.get(`/admin/overview/counts`);
  return response.data;
}
