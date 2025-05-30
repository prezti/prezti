export interface TimezoneInfo {
	name: string // e.g., 'Europe/London'
	gmtOffset: string // e.g., '+0', '+5:30', '-4'
}

/**
 * Maps country codes to their default timezone names
 */
export const countryTimezones: Record<string, string> = {
	US: 'America/New_York',
	CA: 'America/Toronto',
	GB: 'Europe/London',
	AU: 'Australia/Sydney',
	DE: 'Europe/Berlin',
	FR: 'Europe/Paris',
	ES: 'Europe/Madrid',
	IT: 'Europe/Rome',
	JP: 'Asia/Tokyo',
	CN: 'Asia/Shanghai',
	IN: 'Asia/Kolkata',
	BR: 'America/Sao_Paulo',
	RU: 'Europe/Moscow',
	MX: 'America/Mexico_City',
	IL: 'Asia/Jerusalem',
	AE: 'Asia/Dubai',
	SG: 'Asia/Singapore',
	NL: 'Europe/Amsterdam',
	SE: 'Europe/Stockholm',
	CH: 'Europe/Zurich',
}

/**
 * Maps city names to their timezone names
 */
export const cityTimezones: Record<string, string> = {
	London: 'Europe/London',
	Paris: 'Europe/Paris',
	'New York': 'America/New_York',
	'Los Angeles': 'America/Los_Angeles',
	Tokyo: 'Asia/Tokyo',
	Sydney: 'Australia/Sydney',
	Beijing: 'Asia/Shanghai', // Asia/Shanghai is canonical for Beijing
	'Hong Kong': 'Asia/Hong_Kong',
	Jerusalem: 'Asia/Jerusalem',
	'Tel Aviv': 'Asia/Jerusalem',
	Holon: 'Asia/Jerusalem',
	Berlin: 'Europe/Berlin',
	Madrid: 'Europe/Madrid',
	Rome: 'Europe/Rome',
	Amsterdam: 'Europe/Amsterdam',
	Stockholm: 'Europe/Stockholm',
	Zurich: 'Europe/Zurich',
	Dubai: 'Asia/Dubai',
	Singapore: 'Asia/Singapore',
	Moscow: 'Europe/Moscow',
	Toronto: 'America/Toronto',
	'São Paulo': 'America/Sao_Paulo',
	'Mexico City': 'America/Mexico_City',
	Mumbai: 'Asia/Kolkata', // Asia/Kolkata is common for Mumbai
	Delhi: 'Asia/Kolkata', // Asia/Kolkata is common for Delhi
	Cairo: 'Africa/Cairo',
	Nairobi: 'Africa/Nairobi',
	Johannesburg: 'Africa/Johannesburg',
	Lagos: 'Africa/Lagos',
	Casablanca: 'Africa/Casablanca',
	Chicago: 'America/Chicago',
	'Buenos Aires': 'America/Argentina/Buenos_Aires',
	Lima: 'America/Lima',
	Bogota: 'America/Bogota',
	Santiago: 'America/Santiago',
	Vancouver: 'America/Vancouver',
	Montreal: 'America/Toronto', // Montreal typically uses America/Toronto
	Seoul: 'Asia/Seoul',
	Bangkok: 'Asia/Bangkok',
	Jakarta: 'Asia/Jakarta',
	'Kuala Lumpur': 'Asia/Kuala_Lumpur',
	Manila: 'Asia/Manila',
	Brussels: 'Europe/Brussels',
	Vienna: 'Europe/Vienna',
	Copenhagen: 'Europe/Copenhagen',
	Oslo: 'Europe/Oslo',
	Helsinki: 'Europe/Helsinki',
	Warsaw: 'Europe/Warsaw',
	Prague: 'Europe/Prague',
	Budapest: 'Europe/Budapest',
	Athens: 'Europe/Athens',
	Istanbul: 'Europe/Istanbul',
	Melbourne: 'Australia/Melbourne',
	Auckland: 'Pacific/Auckland',
	Perth: 'Australia/Perth',
	'San Juan': 'America/Puerto_Rico', // Puerto Rico
	'Pago Pago': 'Pacific/Pago_Pago', // American Samoa
	Hagåtña: 'Pacific/Guam', // Guam (Using Hagåtña as a key)
	Saipan: 'Pacific/Saipan', // Northern Mariana Islands
	Ottawa: 'America/Toronto', // Capital of Canada
	Calgary: 'America/Edmonton',
	Canberra: 'Australia/Sydney', // Capital of Australia
	'Rio de Janeiro': 'America/Sao_Paulo',
	Brasilia: 'America/Sao_Paulo', // Capital of Brazil, often America/Fortaleza or America/Belem can also be used depending on exact location within Brazil
	'Saint Petersburg': 'Europe/Moscow',
	Dublin: 'Europe/Dublin',
	Lisbon: 'Europe/Lisbon',
	Kyiv: 'Europe/Kyiv',
	Riyadh: 'Asia/Riyadh',
	Tehran: 'Asia/Tehran',
	Accra: 'Africa/Accra',
	'Addis Ababa': 'Africa/Addis_Ababa',
	Algiers: 'Africa/Algiers',
	Caracas: 'America/Caracas',
	'La Paz': 'America/La_Paz',
	Havana: 'America/Havana',
	Kingston: 'America/Jamaica', // Kingston, Jamaica
	'Panama City': 'America/Panama',
	Bengaluru: 'Asia/Kolkata', // Bangalore
	Chennai: 'Asia/Kolkata',
	Hyderabad: 'Asia/Kolkata',
}

/**
 * Maps timezone names to their approximate GMT offsets
 * This is a static mapping for common timezones
 */
export const timezoneOffsets: Record<string, string> = {
	'Europe/London': '+0',
	'Europe/Dublin': '+0',
	'Africa/Accra': '+0',
	'Europe/Lisbon': '+0',
	'Atlantic/Reykjavik': '+0',
	'Europe/Paris': '+1',
	'Europe/Madrid': '+1',
	'Europe/Rome': '+1',
	'Europe/Berlin': '+1',
	'Europe/Amsterdam': '+1',
	'Europe/Stockholm': '+1',
	'Europe/Zurich': '+1',
	'Europe/Brussels': '+1',
	'Europe/Vienna': '+1',
	'Europe/Copenhagen': '+1',
	'Europe/Oslo': '+1',
	'Europe/Warsaw': '+1',
	'Europe/Prague': '+1',
	'Europe/Budapest': '+1',
	'Africa/Algiers': '+1',
	'Africa/Casablanca': '+1',
	'Europe/Athens': '+2',
	'Europe/Istanbul': '+3',
	'Europe/Kyiv': '+2',
	'Europe/Moscow': '+3',
	'Africa/Cairo': '+2',
	'Africa/Nairobi': '+3',
	'Africa/Johannesburg': '+2',
	'Asia/Jerusalem': '+2',
	'Asia/Dubai': '+4',
	'Asia/Tehran': '+3:30',
	'Asia/Riyadh': '+3',
	'Asia/Kolkata': '+5:30',
	'Asia/Shanghai': '+8',
	'Asia/Hong_Kong': '+8',
	'Asia/Singapore': '+8',
	'Asia/Seoul': '+9',
	'Asia/Tokyo': '+9',
	'Asia/Jakarta': '+7',
	'Asia/Bangkok': '+7',
	'Asia/Kuala_Lumpur': '+8',
	'Asia/Manila': '+8',
	'Australia/Sydney': '+10',
	'Australia/Melbourne': '+10',
	'Australia/Perth': '+8',
	'Pacific/Auckland': '+12',
	'Pacific/Pago_Pago': '-11',
	'Pacific/Guam': '+10',
	'Pacific/Saipan': '+10',
	'America/Anchorage': '-9',
	'America/Los_Angeles': '-8',
	'America/Denver': '-7',
	'America/Chicago': '-6',
	'America/New_York': '-5',
	'America/Toronto': '-5',
	'America/Puerto_Rico': '-4',
	'America/Jamaica': '-5',
	'America/Panama': '-5',
	'America/Edmonton': '-7',
	'America/Vancouver': '-8',
	'America/Mexico_City': '-6',
	'America/Caracas': '-4',
	'America/Bogota': '-5',
	'America/Lima': '-5',
	'America/La_Paz': '-4',
	'America/Santiago': '-4',
	'America/Argentina/Buenos_Aires': '-3',
	'America/Sao_Paulo': '-3',
	'America/Havana': '-5',
}

/**
 * Get timezone info based on country code
 * @param countryCode ISO country code (e.g., 'US', 'GB')
 * @returns TimezoneInfo object or null if not found
 */
export function getTimezoneBasedOnCountry(countryCode?: string): TimezoneInfo | null {
	if (!countryCode) return null

	const timezoneName = countryTimezones[countryCode]
	if (!timezoneName) return null

	const gmtOffset = timezoneOffsets[timezoneName] || 'UTC'

	return {
		name: timezoneName,
		gmtOffset,
	}
}

/**
 * Get timezone info based on city name
 * @param cityName Name of the city
 * @returns TimezoneInfo object or null if not found
 */
export function getTimezoneBasedOnCity(cityName?: string): TimezoneInfo | null {
	if (!cityName) return null

	const timezoneName = cityTimezones[cityName]
	if (!timezoneName) return null

	const gmtOffset = timezoneOffsets[timezoneName] || 'UTC'

	return {
		name: timezoneName,
		gmtOffset,
	}
}

/**
 * Format timezone info for display in prompts
 * @param info TimezoneInfo object
 * @returns Formatted timezone string (e.g., "Europe/London (GMT+0)")
 */
export function formatTimezoneInfo(info: TimezoneInfo): string {
	return `${info.name} (GMT${info.gmtOffset})`
}

/**
 * Get timezone info with fallbacks, based on request hints
 * @param requestHints Object containing location data
 * @returns TimezoneInfo object with name and GMT offset
 */
export function getTimezoneInfo(requestHints: { country?: string; city?: string }): TimezoneInfo {
	// Try country-based resolution first
	const countryTimezone = getTimezoneBasedOnCountry(requestHints.country)
	if (countryTimezone) {
		console.info(
			`Using country-based timezone for: ${requestHints.country} -> ${countryTimezone.name} (GMT${countryTimezone.gmtOffset})`
		)
		return countryTimezone
	}

	// Then try city-based resolution
	const cityTimezone = getTimezoneBasedOnCity(requestHints.city)
	if (cityTimezone) {
		console.info(
			`Using city-based timezone for: ${requestHints.city} -> ${cityTimezone.name} (GMT${cityTimezone.gmtOffset})`
		)
		return cityTimezone
	}

	// Default fallback to UTC
	console.info('No timezone match found, defaulting to UTC')
	return {
		name: 'UTC',
		gmtOffset: '+0',
	}
}
