
import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

//
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Async function to test connection
async function testConnection() {
  try {
  
    const result = await pool.query('SELECT NOW()');
    
   
    console.log('✅ Database connected successfully!');
    console.log('📍 Connected to:', process.env.DB_NAME);
    console.log('🕒 Current time from database:', result.rows[0].now);
    
 
    await pool.end();
    
    // Exit successfully (0 = success)
    process.exit(0);
    
  } catch (error) {
  
    console.error('❌ Database connection failed:', error.message);
    console.error('\n💡 Check if:');
    console.error('   1. PostgreSQL is running');
    console.error('   2. Database "taskflow_dev" exists');
    console.error('   3. Password in .env is correct');
    console.error('   4. CONNECTION_URL in .env is correct');
    
    process.exit(1);
  }
}


testConnection();