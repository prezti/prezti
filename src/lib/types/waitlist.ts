/**
 * Waitlist email record structure
 */
export interface WaitlistEmail {
	id: number
	email: string
	latitude: string | null
	longitude: string | null
	city: string | null
	country: string | null
	timezone: string | null
	formatted_date: string | null
	created_at: string
	updated_at: string
}

/**
 * Input for creating a new waitlist entry
 * created_at is optional since the database handles it automatically with defaultNow()
 */
export interface CreateWaitlistEmailInput {
	email: string
	latitude: string | null
	longitude: string | null
	city: string | null
	country: string | null
	timezone: string | null
	formatted_date: string | null
	created_at?: string // Optional since database provides default
}

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
