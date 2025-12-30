import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";

export const student = pgTable("student", {
  id: uuid("id").primaryKey().defaultRandom(),
  student_id: text("student_id").notNull().unique(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  middle_name: text("middle_name"),
  section: text("section").notNull(),
  grade_level: text("grade_level").notNull(),
  parent_name: text("parent_name").notNull(),
  parent_phone_number: text("parent_phone_number").notNull(),
  address: text("address").notNull(),
  rfid_code: text("rfid_code").unique().notNull(),
  photo_url: text("photo_url"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});

export const student_log = pgTable("student_log", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  student_id: uuid("student_id").references(() => student.id),
  device_id: text("device_id"),
  time_in: timestamp("time_in", { mode: "string" }).defaultNow(),
  time_out: timestamp("time_out", { mode: "string" }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});