export const APP_CONFIG = {
	appName: 'Prezti',
	version: '1.0.0',
	description: 'A modern presentation builder',
} as const

export type AppConfig = typeof APP_CONFIG
