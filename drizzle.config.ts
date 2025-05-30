import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/server/db/schema.ts',
	out: './src/server/db/migrations',
	dbCredentials: {
		url: process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/',
	},
	verbose: true,
	strict: true,
})
