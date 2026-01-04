import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";
import { student } from './student.schema'
import { visitor } from './visitor.schema'
import { staff } from './staff.schema'
import { guardian } from './guardian.schema'

export const gate_log = pgTable("gate_log", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  device_id: text("device_id"),
  time_in: timestamp("time_in", { mode: "string" }).defaultNow(),
  time_out: timestamp("time_out", { mode: "string" }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  student_id: uuid("student_id").references(() => student.id),
  visitor_id: uuid("visitor_id").references(() => visitor.id),
  staff_id: uuid("staff_id").references(() => staff.id)
});