DO $$ BEGIN
 CREATE TYPE "public"."admin_role" AS ENUM('admin', 'security', 'developer', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."entry_type" AS ENUM('rfid', 'qr');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."log_type" AS ENUM('student', 'visitor', 'staff', 'guardian');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."staff_type" AS ENUM('faculty', 'guard', 'administrator', 'canteen_vendors', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'rejected', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_type" AS ENUM('student', 'visitor');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" "admin_role" NOT NULL,
	"phone_number" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"photo_url" text,
	"is_super_admin" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"log_type" "log_type" NOT NULL,
	"entry_type" "entry_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"device_id" text,
	"time_in" timestamp DEFAULT now() NOT NULL,
	"time_out" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "otp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"user_type" "user_type" NOT NULL,
	"visitor_id" uuid,
	"admin_id" uuid,
	"revoked" boolean DEFAULT false,
	"expires_at" timestamp,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "otp_visitor_id_unique" UNIQUE("visitor_id"),
	CONSTRAINT "otp_admin_id_unique" UNIQUE("admin_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_id" text NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"middle_name" text,
	"staff_type" "staff_type" NOT NULL,
	"phone_number" text NOT NULL,
	"email" text,
	"rfid_code" text NOT NULL,
	"photo_url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "staff_staff_id_unique" UNIQUE("staff_id"),
	CONSTRAINT "staff_rfid_code_unique" UNIQUE("rfid_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"middle_name" text,
	"section" text NOT NULL,
	"grade_level" text NOT NULL,
	"address" text NOT NULL,
	"rfid_code" text NOT NULL,
	"photo_url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "student_student_id_unique" UNIQUE("student_id"),
	CONSTRAINT "student_rfid_code_unique" UNIQUE("rfid_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visitor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"visitor_id" text NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"middle_initial" text,
	"address" text,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"pin" text DEFAULT '1234' NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"activated" boolean DEFAULT false NOT NULL,
	"valid_id_type" text,
	"valid_id_photo_url" text,
	"photo_url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "visitor_visitor_id_unique" UNIQUE("visitor_id"),
	CONSTRAINT "visitor_email_unique" UNIQUE("email")
);
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "otp" ADD CONSTRAINT "otp_visitor_id_visitor_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "otp" ADD CONSTRAINT "otp_admin_id_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
