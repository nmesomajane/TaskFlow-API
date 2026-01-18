
import Joi from 'joi';
import AppError from '../utils/appError.js';

// Define validation schema for registration
const registerSchema = Joi.object({
  email: Joi.string()
    .email()        
    .required()    
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    
  password: Joi.string()
    .min(8)         
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    }),
    
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
    
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    })
});

// Define validation schema for login
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Middleware function to validate registration data
export const validateRegister = (req, res, next) => {
  // Validate request body against schema
  const { error, value } = registerSchema.validate(req.body, {
    abortEarly: false  
  });

  // If validation fails
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return next(new AppError(errors.join(', '), 400));
  }

  // Validation passed
  req.body = value;  
  next();           
};

// Middleware function to validate login data
export const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return next(new AppError(errors.join(', '), 400));
  }

  req.body = value;
  next();
};