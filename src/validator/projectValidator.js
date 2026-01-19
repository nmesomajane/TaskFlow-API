import Joi from 'joi';
import AppError from '../utils/appError.js';

const createProjectSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.min': 'Project name must be at least 3 characters',
      'string.max': 'Project name cannot exceed 255 characters',
      'any.required': 'Project name is required'
    }),
    
  description: Joi.string()
    .max(2000)
    .allow('', null)
    .messages({
      'string.max': 'Description cannot exceed 2000 characters'
    }),
    
  status: Joi.string()
    .valid('active', 'completed', 'archived')
    .default('active')
    .messages({
      'any.only': 'Status must be one of: active, completed, archived'
    })
});

export const validateCreateProject = (req, res, next) => {
  const { error, value } = createProjectSchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return next(new AppError(errors.join(', '), 400));
  }

  req.body = value;
  next();
};



export const validateUpdateProject = (req, res, next) => {
 
  const updateProjectSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    description: Joi.string().max(2000).allow('', null),
    status: Joi.string().valid('active', 'completed', 'archived')
  });

  const { error, value } = updateProjectSchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return next(new AppError(errors.join(', '), 400));
  }

  req.body = value;
  next();
};