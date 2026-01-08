import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import path from 'path'
import fs from 'fs'

export async function runMigrations() {
  console.log('🔄 Running database migrations...')
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  })
  
  const db = drizzle(pool)
  
  // Use absolute path to ensure migrations folder is found
  const migrationsFolder = path.resolve(process.cwd(), 'drizzle')
  console.log(`📁 Migrations folder: ${migrationsFolder}`)
  console.log(`📁 Current working directory: ${process.cwd()}`)
  console.log(`📁 Checking if migrations folder exists: ${fs.existsSync(migrationsFolder)}`)
  
  if (fs.existsSync(migrationsFolder)) {
    const files = fs.readdirSync(migrationsFolder)
    console.log(`📁 Files in migrations folder: ${files.join(', ')}`)
    
    const metaPath = path.join(migrationsFolder, 'meta')
    console.log(`📁 Checking if meta folder exists: ${fs.existsSync(metaPath)}`)
    
    if (fs.existsSync(metaPath)) {
      const metaFiles = fs.readdirSync(metaPath)
      console.log(`📁 Files in meta folder: ${metaFiles.join(', ')}`)
      
      const journalPath = path.join(metaPath, '_journal.json')
      console.log(`📁 Checking if _journal.json exists: ${fs.existsSync(journalPath)}`)
    }
  }
  
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
