import db from "@/db/drizzle";
import { logs } from "@/db/schema";
import { sql } from "drizzle-orm";

export const getDailyCounts = async (): Promise<{ date: string; visits: number }[]> => {
  try {
    const rows = await db
      .select({ created_at: logs.created_at })
      .from(logs);

    const visitCounts: Record<string, number> = {};

    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    for (const item of rows) {
      const dateUtc = new Date(item.created_at + "Z");
      const datePh = new Date(dateUtc.getTime() + 8 * 60 * 60 * 1000);
      const dateStr = datePh.toISOString().slice(0, 10);

      visitCounts[dateStr] = (visitCounts[dateStr] || 0) + 1;

      const currDate = new Date(dateStr);
      if (!minDate || currDate < minDate) minDate = currDate;
      if (!maxDate || currDate > maxDate) maxDate = currDate;
    }

    const todayPh = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
    todayPh.setHours(0, 0, 0, 0);

    if (!minDate) return [];

    const endDate = maxDate && maxDate > todayPh ? maxDate : todayPh;

    const result: { date: string; visits: number }[] = [];
    let cursor = new Date(minDate);

    while (cursor <= endDate) {
      const dateStr = cursor.toISOString().slice(0, 10);
      result.push({ date: dateStr, visits: visitCounts[dateStr] || 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  } catch {
    return [];
  }
};

export const getWeekdayCounts = async () => {
  const DEFAULT = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

  try {
    const rows = await db
      .select({ created_at: logs.created_at })
      .from(logs)
      .where(sql`${logs.created_at} >= NOW() - INTERVAL '28 days'`);

    const DAY_MAP = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = { ...DEFAULT };

    for (const row of rows) {
      const dateUtc = new Date(row.created_at + "Z");
      const dayName = DAY_MAP[dateUtc.getDay()];
      result[dayName]++;
    }
    
    return Object.entries(result).map(([day, visits]) => ({ day, visits }));
  } catch {
    return Object.entries(DEFAULT).map(([day, visits]) => ({ day, visits }));
  }
};
