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
  enrollment_secret: text('enrollment_secret').unique().notNull(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  middle_name: text("middle_name"),
  section: text("section").notNull(),
  grade_level: text("grade_level").notNull(),
  address: text("address").notNull(),
  rfid_code: text("rfid_code").unique().notNull(),
  photo_url: text("photo_url"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});