import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error('DATABASE_URL environment variable is required')
}

// Create the postgres connection
const connectionString = databaseUrl
const client = postgres(connectionString, { max: 1 })

// Create the drizzle database instance
export const db = drizzle(client, { schema })

// Export the schema for use in other parts of the application
export { schema }
