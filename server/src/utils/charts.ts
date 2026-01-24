import db from "@/db/drizzle";
import { logs } from "@/db/schema";
import { sql } from "drizzle-orm";

export const getDailyCounts = async () => {
  try {
    const rows = await db
      .select({
        day: sql<string>`DATE(${logs.created_at})`,
        count: sql<number>`COUNT(*)`
      })
      .from(logs)
      .groupBy(sql`DATE(${logs.created_at})`)
      .orderBy(sql`DATE(${logs.created_at})`);

    const counts = Object.fromEntries(
      rows.map(r => [r.day, Number(r.count)])
    );

    const start = new Date(rows[0].day);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const result: Array<{ date: string; visits: number }> = [];

    for (let d = new Date(start); d <= today; d.setUTCDate(d.getUTCDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      result.push({
        date: key,
        visits: counts[key] ?? 0
      });
    }

    return result;
  } catch (err) {
    return [];
  }
};


export const getWeekdayCounts = async () => {
  const DEFAULT = {
    Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0
  };

  try {
    const rows = await db
      .select({
        weekday: sql<number>`EXTRACT(DOW FROM ${logs.created_at})`,
        count: sql<number>`COUNT(*)`
      })
      .from(logs)
      .where(sql`${logs.created_at} >= NOW() - INTERVAL '28 days'`)
      .groupBy(sql`EXTRACT(DOW FROM ${logs.created_at})`);

    const DAY_MAP = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = { ...DEFAULT };

    for (const row of rows) {
      const name = DAY_MAP[row.weekday];
      result[name] = Number(row.count);
    }

    return Object.entries(result).map(([day, visits]) => ({
      day,
      visits
    }));

  } catch (err) {
    return Object.entries(DEFAULT).map(([day, visits]) => ({
      day,
      visits
    }));
  }
};
