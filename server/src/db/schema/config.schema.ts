import {
  pgTable,
  uuid,
  timestamp,
  boolean
} from "drizzle-orm/pg-core";

export const config = pgTable("config", {
  id: uuid("id").primaryKey().defaultRandom(),
  emergency_open: boolean("emergency_open").default(false),
  tracking_mode: boolean("tracking_mode").default(false),
  sms_alerts: boolean("sms_alerts").default(true),
  last_update: timestamp("created_at", { mode: "string" }).defaultNow()
});