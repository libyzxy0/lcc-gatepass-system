import db from "@/db/drizzle";
import { config } from "@/db/schema";

const configSeeder = async () => {
  try {
    const data = await db.insert(config).values({
        tracking_mode: false,
        emergency_open: false,
        sms_alerts: true
      });
      console.log(data);
  } catch (error) {
    console.error(error);
  }
}

configSeeder();