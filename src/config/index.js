import dotenv from 'dotenv';

dotenv.config();


//  environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT'
];

// Checks if variables are set
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const config = {
  // Environment (development, production, test)
  env: process.env.NODE_ENV || 'development',
  
    // Server port
  port: parseInt(process.env.PORT, 10) || 3000,
  
  // Database settings
  database: {
    
    url: process.env.DATABASE_URL,
 
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  
  // JWT settings
  jwt: {
    
    secret: process.env.JWT_SECRET,
   
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // API version
  api: {
    version: process.env.API_VERSION || 'v1'
  }
};


export default config;