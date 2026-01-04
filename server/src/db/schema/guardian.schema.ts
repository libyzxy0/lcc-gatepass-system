import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";

export const guardian = pgTable("guardian", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  middle_name: text("middle_name"),
  phone_number: text("parent_phone_number").notNull(),
  address: text("address").notNull(),
  rfid_code: text("rfid_code").notNull(),
  relationship: text("relationship").notNull(),
  photo_url: text("photo_url"),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow()
});