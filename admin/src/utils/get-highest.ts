type HighestType = {
  students: number;
  visitors: number;
  staffs: number;
  other: number;
}

export const getPeopleTypeWithHighestValue = (
  data: HighestType
): (keyof HighestType)[] => {
  
  if(data.students === 0 && data.visitors === 0 && data.staffs === 0 && data.other === 0) return [];

  const values = Object.values(data);
  if (values.length === 0) return [];

  const maxVal = Math.max(...values);

  return (Object.keys(data) as (keyof HighestType)[])
    .filter(key => data[key] === maxVal);
};