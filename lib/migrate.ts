import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import path from 'path'

export async function runMigrations() {
  console.log('🔄 Running database migrations...')
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  })
  
  const db = drizzle(pool)
  
  // Use absolute path to ensure migrations folder is found
  const migrationsFolder = path.resolve(process.cwd(), 'drizzle')
  console.log(`📁 Migrations folder: ${migrationsFolder}`)
  
  try {
    await migrate(db, { migrationsFolder })
    console.log('✅ Database migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}
