DO $$ BEGIN
 CREATE TYPE "public"."log_type" AS ENUM('student', 'visitor', 'staff', 'guardian');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "status" ADD VALUE 'expired';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gatepass" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"visitor_id" uuid NOT NULL,
	"purpose" text NOT NULL,
	"description" text NOT NULL,
	"vehicle_type" text,
	"vehicle_plate" text,
	"qr_token" text,
	"schedule_date" timestamp NOT NULL,
	"status" "status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "gatepass_qr_token_unique" UNIQUE("qr_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guardian" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"middle_name" text,
	"parent_phone_number" text NOT NULL,
	"address" text NOT NULL,
	"rfid_code" text NOT NULL,
	"relationship" text NOT NULL,
	"photo_url" text,
	"created_at" timestamp DEFAULT now(),
	"student_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gate_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"log_type" "log_type",
	"student_id" uuid NOT NULL,
	"device_id" text,
	"time_in" timestamp DEFAULT now() NOT NULL,
	"time_out" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "qr_code";--> statement-breakpoint
DROP TABLE "staff_log";--> statement-breakpoint
DROP TABLE "student_log";--> statement-breakpoint
DROP TABLE "visit";--> statement-breakpoint
DROP TABLE "visitor_log";--> statement-breakpoint
ALTER TABLE "visitor" ALTER COLUMN "pin" SET DEFAULT '1234';--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "middle_name" text;--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "visitor" ADD COLUMN "address" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gatepass" ADD CONSTRAINT "gatepass_visitor_id_visitor_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guardian" ADD CONSTRAINT "guardian_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "student" DROP COLUMN IF EXISTS "middle_initial";--> statement-breakpoint
ALTER TABLE "student" DROP COLUMN IF EXISTS "parent_phone_number";--> statement-breakpoint
ALTER TABLE "student" DROP COLUMN IF EXISTS "parent_email";