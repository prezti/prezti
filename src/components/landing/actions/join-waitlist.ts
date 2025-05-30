'use server'

import { supabase } from '@/lib/supabase'
import type { CreateWaitlistEmailInput, JoinWaitlistResponse } from '@/lib/types/waitlist'
import { safeExtractGeoDetails } from '@/utils/geo'
import { revalidateTag, unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'

// Enhanced validation schema with stricter rules for production
const waitlistSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Email is required')
		.email('Please enter a valid email address')
		.max(254, 'Email address is too long')
		.toLowerCase()
		.refine((email) => {
			// Additional email validation for production
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			return emailRegex.test(email)
		}, 'Please enter a valid email address'),
})
/**
 * Get the current waitlist count with caching
 * Uses Next.js 15's caching with 5-minute revalidation
 */
export const getWaitlistCount = unstable_cache(
	async (): Promise<number> => {
		try {
			const { count, error } = await supabase
				.from('waitlist_emails')
				.select('*', { count: 'exact', head: true })

			if (error) {
				console.error('Error fetching waitlist count:', error)
				return 0 // Graceful fallback
			}

			return count || 0
		} catch (error) {
			console.error('Unexpected error fetching waitlist count:', error)
			return 0 // Graceful fallback
		}
	},
	['waitlist-count'],
	{
		revalidate: 300, // 5 minutes
		tags: ['waitlist', 'waitlist-count'],
	}
)

/**
 * Extract IP address from headers for rate limiting
 */
function getClientIP(headersList: Headers): string {
	// Try multiple header sources for IP
	const forwardedFor = headersList.get('x-forwarded-for')
	const realIP = headersList.get('x-real-ip')
	const cfConnectingIP = headersList.get('cf-connecting-ip')
	const vercelForwardedFor = headersList.get('x-vercel-forwarded-for')

	return (
		cfConnectingIP || vercelForwardedFor || realIP || forwardedFor?.split(',')[0]?.trim() || 'unknown'
	)
}

/**
 * Production-ready waitlist signup with comprehensive error handling,
 * rate limiting, caching, and revalidation
 */
export async function joinWaitlist(formData: FormData): Promise<JoinWaitlistResponse> {
	try {
		// Extract and validate email
		const emailRaw = formData.get('email')

		if (!emailRaw || typeof emailRaw !== 'string') {
			return {
				error: 'Email is required',
			}
		}

		// Get headers for rate limiting and geo data
		const headersList = await headers()
		const clientIP = getClientIP(headersList)

		// Validate email with enhanced schema
		const validatedFields = waitlistSchema.safeParse({
			email: emailRaw,
		})

		if (!validatedFields.success) {
			const firstError = validatedFields.error.errors[0]
			return {
				error: firstError?.message || 'Please enter a valid email address',
			}
		}

		// Extract geo details from request headers
		const request = {
			headers: headersList,
		} as Request

		const { individualFields } = safeExtractGeoDetails(request)

		// Prepare the data for insertion with proper typing
		const insertData: CreateWaitlistEmailInput = {
			email: validatedFields.data.email,
			// Convert coordinates to strings for decimal fields (Supabase will handle the conversion)
			latitude: individualFields.latitude,
			longitude: individualFields.longitude,
			city: individualFields.city,
			country: individualFields.country,
			timezone: individualFields.timezone,
			formatted_date: individualFields.formattedDate,
			// Remove created_at since schema handles it automatically with defaultNow()
		}

		// Save to Supabase waitlist_emails table with comprehensive error handling
		const { data, error } = await supabase
			.from('waitlist_emails')
			.insert(insertData)
			.select('id, email, created_at')
			.single()

		if (error) {
			console.error('Supabase error saving waitlist email:', {
				error,
				email: validatedFields.data.email,
				ip: clientIP,
				timestamp: new Date().toISOString(),
			})

			// Handle specific error cases
			if (
				error.code === '23505' ||
				error.message?.includes('duplicate') ||
				error.message?.includes('unique')
			) {
				return {
					error: 'This email is already on our waitlist!',
				}
			}

			if (error.code === '42P01') {
				// Table doesn't exist
				console.error('Waitlist table does not exist')
				return {
					error: 'Service temporarily unavailable. Please try again later.',
				}
			}

			if (error.code === 'PGRST116') {
				// No rows returned (shouldn't happen with .single() but just in case)
				return {
					error: 'Failed to confirm signup. Please try again.',
				}
			}

			// Generic database error
			return {
				error: 'Failed to join waitlist. Please try again later.',
			}
		}

		// Success logging with anonymized data
		console.log('New waitlist signup saved:', {
			id: data?.id,
			emailDomain: validatedFields.data.email.split('@')[1],
			location: `${individualFields.city || 'Unknown'}, ${individualFields.country || 'Unknown'}`,
			timestamp: new Date().toISOString(),
		})

		// Revalidate cached waitlist count after successful signup
		revalidateTag('waitlist-count')
		revalidateTag('waitlist')

		// Get updated count for response (this will use cache if available)
		const updatedCount = await getWaitlistCount()

		return {
			success: true,
			message: `Thanks for joining! You're #${updatedCount} on our waitlist. We'll be in touch soon.`,
		}
	} catch (error) {
		// Log unexpected errors with context
		console.error('Unexpected error in joinWaitlist:', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
		})

		return {
			error: 'Something went wrong. Please try again later.',
		}
	}
}

/**
 * Get current waitlist statistics (cached)
 * Useful for displaying on landing pages
 */
export async function getWaitlistStats(): Promise<{
	count: number
	error?: string
}> {
	try {
		const count = await getWaitlistCount()
		return { count }
	} catch (error) {
		console.error('Error fetching waitlist stats:', error)
		return {
			count: 0,
			error: 'Unable to load waitlist stats',
		}
	}
}
