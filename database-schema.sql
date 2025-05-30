-- Prezti Database Schema
-- This file contains the complete database schema for the Prezti application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Waitlist emails table for storing email signups with geographic details
-- Stores user email signups along with their geographic information
-- extracted from request headers for analytics and targeted outreach
CREATE TABLE IF NOT EXISTS "waitlist_emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(254) NOT NULL, -- RFC 5321 compliant max email length
	"latitude" numeric(10, 8), -- -90.00000000 to 90.00000000
	"longitude" numeric(11, 8), -- -180.00000000 to 180.00000000
	"city" varchar(100),
	"country" varchar(100),
	"timezone" varchar(100),
	"formatted_date" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_emails_email_unique" UNIQUE("email")
);

-- Indexes for performance optimization
CREATE UNIQUE INDEX IF NOT EXISTS "idx_waitlist_emails_email" ON "waitlist_emails" USING btree ("email");
CREATE INDEX IF NOT EXISTS "idx_waitlist_emails_country" ON "waitlist_emails" USING btree ("country");
CREATE INDEX IF NOT EXISTS "idx_waitlist_emails_created_at" ON "waitlist_emails" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "idx_waitlist_emails_location" ON "waitlist_emails" USING btree ("country","city");

-- Row Level Security (RLS) policies
-- Note: For waitlist, we typically don't need complex RLS since it's public signup
-- But we can add basic protection against direct table access

-- Enable RLS on the table
ALTER TABLE "waitlist_emails" ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for signups (this is what the join-waitlist action uses)
CREATE POLICY "Allow public signup inserts" ON "waitlist_emails"
    FOR INSERT 
    WITH CHECK (true);

-- Restrict selects to service role only (for admin/analytics)
-- This ensures only server-side code can read the full waitlist
CREATE POLICY "Service role can read all" ON "waitlist_emails"
    FOR SELECT 
    TO service_role
    USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on row updates
CREATE TRIGGER update_waitlist_emails_updated_at 
    BEFORE UPDATE ON "waitlist_emails"
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 