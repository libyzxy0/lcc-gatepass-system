import { type OverviewCountsType } from '@/api/helpers/overview';

type ReturnType = {
  students: number;
  visitors: number;
  staffs: number;
  other: number;
}

export const getPeopleTypeWithHighestValue = (
  data: OverviewCountsType
): (keyof ReturnType)[] => {
  const obj: ReturnType = {
    students: data.students_today,
    visitors: data.visitors_today,
    staffs: data.staffs_today,
    other: data.other_people,
  };

  const values = Object.values(obj);
  if (values.length === 0) return [];

  const maxVal = Math.max(...values);

  return (Object.keys(obj) as (keyof ReturnType)[])
    .filter(key => obj[key] === maxVal);
};
