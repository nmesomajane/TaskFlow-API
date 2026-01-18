
import { verifyToken } from '../utils/jwt.js';
import userRepository from '../repositories/userRepository.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Middleware to check if user is authenticated
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    throw new AppError('You are not logged in. Please log in to access this resource', 401);
  }

  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    throw new AppError('Invalid or expired token. Please log in again', 401);
  }

  
  const user = await userRepository.findById(decoded.userId);
  
  if (!user) {
    throw new AppError('The user belonging to this token no longer exists', 401);
  }

  
  req.user = user;
  next();
});