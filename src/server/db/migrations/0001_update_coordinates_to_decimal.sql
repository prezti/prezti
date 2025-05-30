ALTER TABLE "waitlist_emails" ALTER COLUMN "email" SET DATA TYPE varchar(254);--> statement-breakpoint
ALTER TABLE "waitlist_emails" ALTER COLUMN "latitude" SET DATA TYPE numeric(10, 8);--> statement-breakpoint
ALTER TABLE "waitlist_emails" ALTER COLUMN "longitude" SET DATA TYPE numeric(11, 8);--> statement-breakpoint
CREATE INDEX "idx_waitlist_emails_location" ON "waitlist_emails" USING btree ("country","city");