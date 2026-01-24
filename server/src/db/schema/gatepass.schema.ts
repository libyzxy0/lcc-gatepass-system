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
  "rejected",
  "expired"
]);

export const gatepass = pgTable("gatepass", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  gatepass_id: text('gatepass_id').notNull().unique(),
  visitor_id: uuid("visitor_id").references(() => visitor.id).notNull(),
  purpose: text("purpose").notNull(),
  description: text("description").notNull(),
  vehicle_type: text("vehicle_type"),
  vehicle_plate: text("vehicle_plate"),
  qr_token: text("qr_token").unique(),
  schedule_date: timestamp("schedule_date", { mode: "string" }),
  student_pass: boolean("student_pass").default(false),
  entity_id: uuid("entity_id").default(null),
  status: statusEnum("status").default("pending"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
})