import { index, pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'

/**
 * Waitlist emails table for storing email signups with geographic details
 * This table stores user email signups along with their geographic information
 * extracted from request headers for analytics and targeted outreach.
 */
export const waitlistEmails = pgTable(
	'waitlist_emails',
	{
		id: serial('id').primaryKey(),
		email: varchar('email', { length: 254 }).notNull().unique(), // RFC 5321 max email length
		// Using varchar for coordinates since they come as strings from geo headers
		// and may contain non-numeric values or need to preserve exact format
		latitude: varchar('latitude', { length: 50 }), // e.g., "37.7749" or null
		longitude: varchar('longitude', { length: 50 }), // e.g., "-122.4194" or null
		city: varchar('city', { length: 100 }),
		country: varchar('country', { length: 100 }),
		timezone: varchar('timezone', { length: 100 }),
		formatted_date: varchar('formatted_date', { length: 200 }),
		created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => {
		return {
			// Index on email for fast lookups and uniqueness
			emailIdx: uniqueIndex('idx_waitlist_emails_email').on(table.email),
			// Index on country for analytics queries
			countryIdx: index('idx_waitlist_emails_country').on(table.country),
			// Index on created_at for temporal queries and pagination
			createdAtIdx: index('idx_waitlist_emails_created_at').on(table.created_at),
			// Composite index for geo-based analytics
			locationIdx: index('idx_waitlist_emails_location').on(table.country, table.city),
		}
	}
)

// Type exports for use in application code
export type WaitlistEmail = typeof waitlistEmails.$inferSelect
export type NewWaitlistEmail = typeof waitlistEmails.$inferInsert

// Additional utility types for the application
export type WaitlistEmailInsert = Omit<NewWaitlistEmail, 'id' | 'created_at' | 'updated_at'>
export type WaitlistEmailUpdate = Partial<Omit<NewWaitlistEmail, 'id' | 'created_at'>>
