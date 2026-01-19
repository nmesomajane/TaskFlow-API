import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './connection.js';

// Get current directory (needed for ES6 modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...\n');

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = await fs.readdir(migrationsDir);
    
    // Sort migration files
    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    if (sqlFiles.length === 0) {
      console.log('⚠️  No migration files found!');
      process.exit(1);
    }

    for (const file of sqlFiles) {
      console.log(`📄 Running migration: ${file}`);
      
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, 'utf8');
      
      await pool.query(sql);
      console.log(`✅ Completed: ${file}\n`);
    }

    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();