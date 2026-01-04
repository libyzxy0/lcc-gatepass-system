import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";

export const staffTypeEnum = pgEnum("staff_type", [
  "teacher",
  "guard",
  "administrator",
  "canteen_vendors",
  "other"
]);

export const staff = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  staff_id: text("staff_id").notNull().unique(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  middle_initial: text("middle_initial"),
  staff_type: staffTypeEnum('staff_type').notNull(),
  phone_number: text("phone_number").notNull(),
  email: text("email"),
  rfid_code: text("rfid_code").unique().notNull(),
  photo_url: text("photo_url"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});