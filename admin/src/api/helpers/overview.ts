import { api } from '../axios';

export type OverviewCountsType = {
  students: number;
  pending_gatepass: number;
  other_people: number;
  staffs_today: number;
  students_today: number;
  visitors_today: number;
  people_today: number;
}

type WeekdayType = {
  day: string;
  visits: number;
}

type DailyType = {
  date: string;
  visits: number;
}

type MostType = {
  students: number;
  visitors: number;
  staffs: number;
  other: number;
}

type ChartsType = {
  daily: DailyType[];
  weekday: WeekdayType[];
  most: MostType | null;
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
      staffs_today: 0,
      people_today: 0
    }
    throw error;
  }
}

export const getCharts = async (): Promise<ChartsType> => {
  try {
    const response = await api.get(`/admin/charts`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return {
      daily: [],
      weekday: [],
      most: null
    }
    throw error;
  }
}
