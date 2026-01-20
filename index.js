
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './src/config/index.js';
import pool from './src/database/connection.js';
import router from './src/Routers/auth.js';
import projectRouter from './src/Routers/project.js';
import errorHandler from './src/middleware/errorHandler.js';
import AppError from './src/utils/appError.js';


import dotenv from 'dotenv';
dotenv.config();

// Create Express app
const app = express();

// MIDDLEWARE
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

// ROUTES

// Home route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'TaskFlow API is running!',
    version: config.api.version
  });
});


app.use(`/api/${config.api.version}/auth`, router);
app.use(`/api/${config.api.version}/projects`, projectRouter);



app.use(errorHandler);

// Database connection test and server start
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully');
    
    // Start server
    app.listen(config.port, () => {
      console.log(` Server running on port ${config.port}`);
      console.log(` Environment: ${config.env}`);
      console.log(` API: http://localhost:${config.port}/api/${config.api.version}`);
      console.log('\n Available Auth Routes:');
      console.log(`   POST http://localhost:${config.port}/api/${config.api.version}/auth/signup`);
      console.log(`   POST http://localhost:${config.port}/api/${config.api.version}/auth/signin`);
      console.log(`   GET  http://localhost:${config.port}/api/${config.api.version}/profile`);
      console.log(`   POST http://localhost:${config.port}/api/${config.api.version}/auth/signout`);
    });
  }
});