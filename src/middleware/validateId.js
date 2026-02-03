import AppError from '../utils/appError.js';

export const validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = parseInt(req.params[paramName], 10);
    
    if (isNaN(id) || id < 1) {
      throw new AppError(`Invalid ${paramName}. Must be a positive number`, 400);
    }
    
    // Store parsed ID back to params
    req.params[paramName] = id;
    next();
  };
};