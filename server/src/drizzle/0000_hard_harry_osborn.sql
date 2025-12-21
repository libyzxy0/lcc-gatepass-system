DO $$ BEGIN
 CREATE TYPE "public"."admin_role" AS ENUM('admin', 'guard', 'developer', 'department_head');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."staff_type" AS ENUM('teacher', 'guard', 'administrator', 'canteen_vendors', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'rejected', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_type" AS ENUM('student', 'visitor', 'staff');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
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
CREATE TABLE IF NOT EXISTS "qr_code" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_type" "user_type" NOT NULL,
	"visit_id" uuid,
	"student_id" uuid,
	"qr_token" text NOT NULL,
	"active" boolean DEFAULT false,
	"is_one_time" boolean DEFAULT true,
	"secured" boolean DEFAULT false,
	"revoked" boolean DEFAULT false,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "qr_code_qr_token_unique" UNIQUE("qr_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_id" text NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"middle_initial" text,
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
CREATE TABLE IF NOT EXISTS "staff_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_id" uuid,
	"device_id" text,
	"time_in" timestamp DEFAULT now(),
	"time_out" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"middle_initial" text,
	"section" text NOT NULL,
	"grade_level" text NOT NULL,
	"parent_phone_number" text NOT NULL,
	"parent_email" text,
	"rfid_code" text NOT NULL,
	"photo_url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "student_student_id_unique" UNIQUE("student_id"),
	CONSTRAINT "student_rfid_code_unique" UNIQUE("rfid_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid,
	"device_id" text,
	"time_in" timestamp DEFAULT now(),
	"time_out" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"visitor_id" uuid,
	"purpose" text NOT NULL,
	"description" text NOT NULL,
	"visiting" text,
	"schedule_date" timestamp,
	"status" "status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visitor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"visitor_id" text NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"middle_initial" text,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"pin" text NOT NULL,
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
CREATE TABLE IF NOT EXISTS "visitor_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"visitor_id" uuid,
	"device_id" text,
	"visiting" text,
	"purpose" text,
	"time_in" timestamp DEFAULT now(),
	"time_out" timestamp,
	"created_at" timestamp DEFAULT now()
);
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "qr_code" ADD CONSTRAINT "qr_code_visit_id_visit_id_fk" FOREIGN KEY ("visit_id") REFERENCES "public"."visit"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "qr_code" ADD CONSTRAINT "qr_code_student_id_visitor_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."visitor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staff_log" ADD CONSTRAINT "staff_log_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_log" ADD CONSTRAINT "student_log_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visit" ADD CONSTRAINT "visit_visitor_id_visitor_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visitor_log" ADD CONSTRAINT "visitor_log_visitor_id_visitor_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
