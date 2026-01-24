import db from "@/db/drizzle";
import { logs } from "@/db/schema";
import { sql } from "drizzle-orm";

(async () => {
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

    const result = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };

    for (const row of rows) {
      const name = DAY_MAP[row.weekday];
      result[name] = Number(row.count);
    }

    console.log(result);

  } catch (err) {
    console.error(err);
  }
})();
