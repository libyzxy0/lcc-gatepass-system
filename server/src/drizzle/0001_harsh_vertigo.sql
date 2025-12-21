ALTER TABLE "visit" ALTER COLUMN "visiting" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "visit" ALTER COLUMN "schedule_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "visit" ADD COLUMN "secured" boolean DEFAULT true NOT NULL;