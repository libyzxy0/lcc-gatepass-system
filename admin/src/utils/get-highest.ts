import { type OverviewCountsType } from '@/api/helpers/overview';

export const getPeopleTypeWithHighestValue = <T extends OverviewCountsType>(data: T): (keyof T)[] => {
  
  const obj = {
    students: data.students_today,
    visitors: data.visitors_today,
    staffs: data.staffs_today,
    other: data.other_people,
  }
  
  const values = Object.values(obj) as number[];
  
  if (values.length === 0) return [];

  const maxVal = Math.max(...values);
  
  return (Object.keys(obj) as (keyof T)[]).filter(key => obj[key] === maxVal);
};
