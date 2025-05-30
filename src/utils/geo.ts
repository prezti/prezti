import { formatInTimeZone } from 'date-fns-tz'
import { formatTimezoneInfo, getTimezoneInfo } from './timezone'

export interface RequestHints {
	latitude?: string
	longitude?: string
	city?: string
	country?: string
}

export function getReqGeoDetailsFromHints(requestHints: RequestHints) {
	const timezoneInfo = getTimezoneInfo({
		country: requestHints.country,
		city: requestHints.city,
	})
	const resolvedTimezone = timezoneInfo.name
	let localizedDateTime = ''

	try {
		const now = new Date()
		localizedDateTime = formatInTimeZone(now, resolvedTimezone, "EEEE, do 'of' MMMM yyyy h:mm a")
	} catch (error) {
		console.error('Error formatting date in timezone:', error)
		localizedDateTime = '[Date/Time formatting error]'
	}

	const reqGeoDetails = `\
About the origin of user's request:
- lat: ${requestHints.latitude}
- lon: ${requestHints.longitude}
- city: ${requestHints.city}
- country: ${requestHints.country}
- timezone: ${formatTimezoneInfo(timezoneInfo)}
- formatted_date: ${localizedDateTime}
`
	return reqGeoDetails
}

/**
 * Extract geo details from Vercel's geo headers
 */
export function extractGeoFromHeaders(headers: Headers): RequestHints {
	return {
		latitude: headers.get('x-vercel-ip-latitude') || undefined,
		longitude: headers.get('x-vercel-ip-longitude') || undefined,
		city: headers.get('x-vercel-ip-city') || undefined,
		country: headers.get('x-vercel-ip-country') || undefined,
	}
}

/**
 * Safely extract geo details with fallbacks
 */
export function safeExtractGeoDetails(request?: Request): {
	geoHints: RequestHints
	individualFields: {
		latitude: string | null
		longitude: string | null
		city: string | null
		country: string | null
		timezone: string | null
		formattedDate: string | null
	}
} {
	let geoHints: RequestHints = {}

	if (request?.headers) {
		try {
			geoHints = extractGeoFromHeaders(request.headers)
		} catch (error) {
			console.error('Error extracting geo details:', error)
		}
	}

	const timezoneInfo = getTimezoneInfo({
		country: geoHints.country,
		city: geoHints.city,
	})

	let formattedDate: string | null = null
	try {
		const now = new Date()
		formattedDate = formatInTimeZone(now, timezoneInfo.name, "EEEE, do 'of' MMMM yyyy h:mm a")
	} catch (error) {
		console.error('Error formatting date:', error)
	}

	return {
		geoHints,
		individualFields: {
			latitude: geoHints.latitude || null,
			longitude: geoHints.longitude || null,
			city: geoHints.city || null,
			country: geoHints.country || null,
			timezone: formatTimezoneInfo(timezoneInfo),
			formattedDate,
		},
	}
}
