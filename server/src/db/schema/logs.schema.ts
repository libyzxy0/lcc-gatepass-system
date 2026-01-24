import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";

export const logTypeEnum = pgEnum("log_type", [
  "student",
  "visitor",
  "staff",
  "guardian"
]);

export const entryTypeUsedEnum = pgEnum("entry_type", [
  "rfid",
  "qr"
]);


export const logs = pgTable("logs", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  log_id: text('log_id').notNull().unique(),
  name: text('name').notNull(),
  type: logTypeEnum('log_type').notNull(),
  entry_type: entryTypeUsedEnum('entry_type').notNull(),
  entity_id: uuid("entity_id").notNull(),
  device_id: text("device_id"),
  time_in: timestamp("time_in", { mode: "string" }).defaultNow().notNull(),
  time_out: timestamp("time_out", { mode: "string" }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});