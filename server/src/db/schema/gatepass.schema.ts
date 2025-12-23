import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";
import { visitor } from './visitor.schema'

export const statusEnum = pgEnum("status", [
  "pending",
  "approved",
  "rejected"
]);

export const gatepass = pgTable("gatepass", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  visitor_id: uuid("visitor_id").references(() => visitor.id),
  purpose: text("purpose").notNull(),
  description: text("description").notNull(),
  vehicle_type: text("vehicle_type"),
  vehicle_plate: text("vehicle_plate"),
  qr_token: text("qr_token").unique(),
  schedule_date: timestamp("schedule_date", { mode: "string" }).notNull(),
  status: statusEnum("status").default("pending"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
})