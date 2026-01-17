
import jwt from 'jsonwebtoken';

import config from '../config/index.js';

// Generate JWT token for a user
export const generateToken = (userId) => {
  
  return jwt.sign(
    { userId },
    config.jwt.secret,
    

    { expiresIn: config.jwt.expiresIn }
  );
};


export const verifyToken = (token) => {
  try {
   
    const decoded = jwt.verify(token, config.jwt.secret);
    
   
    return decoded;
    
  } catch (error) {

    return null;
  }
};