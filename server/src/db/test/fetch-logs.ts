import db from "@/db/drizzle";
import { logs } from "@/db/schema";
import { eq } from 'drizzle-orm';

(async () => {
  try {
    const allLogs = await db.select({ created_at: logs.created_at }).from(logs);
    
    const dateonlylogs = allLogs.map((item) => (item.created_at.split(" "))[0]);
    
    console.log(dateonlylogs)
  } catch (error) {
    console.error(error);
  }
})();