CREATE TABLE "waitlist_emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"latitude" varchar(50),
	"longitude" varchar(50),
	"city" varchar(100),
	"country" varchar(100),
	"timezone" varchar(100),
	"formatted_date" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_emails_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_waitlist_emails_email" ON "waitlist_emails" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_waitlist_emails_country" ON "waitlist_emails" USING btree ("country");--> statement-breakpoint
CREATE INDEX "idx_waitlist_emails_created_at" ON "waitlist_emails" USING btree ("created_at");