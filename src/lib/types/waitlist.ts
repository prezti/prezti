import { z } from 'zod'

// Re-export the Drizzle generated types from schema
export type {
	NewWaitlistEmail,
	WaitlistEmail,
	WaitlistEmailInsert,
	WaitlistEmailUpdate,
} from '@/server/db/schema'

/**
 * Zod schema for waitlist email validation
 * Enhanced validation with production-ready rules
 */
export const waitlistEmailSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Email is required')
		.email('Please enter a valid email address')
		.max(254, 'Email address is too long') // RFC 5321 maximum
		.toLowerCase()
		.refine((email) => {
			// Additional email validation for production
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			return emailRegex.test(email)
		}, 'Please enter a valid email address'),
})

/**
 * Schema for creating a new waitlist entry
 * Used for server-side validation
 */
export const createWaitlistEmailSchema = z.object({
	email: waitlistEmailSchema.shape.email,
	latitude: z.string().nullable().optional(),
	longitude: z.string().nullable().optional(),
	city: z.string().max(100).nullable().optional(),
	country: z.string().max(100).nullable().optional(),
	timezone: z.string().max(100).nullable().optional(),
	formatted_date: z.string().max(200).nullable().optional(),
})

/**
 * Schema for client-side form validation (just email)
 */
export const waitlistFormSchema = z.object({
	email: waitlistEmailSchema.shape.email,
})

/**
 * Response type for the join waitlist action
 */
export interface JoinWaitlistResponse {
	success?: boolean
	error?: string
	message?: string
	count?: number
}

/**
 * Geographic details extracted from request
 */
export interface GeoDetails {
	latitude: string | null
	longitude: string | null
	city: string | null
	country: string | null
	timezone: string | null
	formattedDate: string | null
}

/**
 * Waitlist statistics for display purposes
 */
export interface WaitlistStats {
	count: number
	error?: string
	lastUpdated?: string
}

// Type inference from schemas
export type CreateWaitlistEmailInput = z.infer<typeof createWaitlistEmailSchema>
export type WaitlistFormData = z.infer<typeof waitlistFormSchema>
