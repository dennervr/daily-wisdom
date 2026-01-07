import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

export async function runMigrations() {
  console.log('🔄 Running database migrations...')
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  })
  
  const db = drizzle(pool)
  
  try {
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('✅ Database migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}
