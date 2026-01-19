import Joi from 'joi';
import AppError from '../utils/appError.js';

const createTaskSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.min': 'Task title must be at least 3 characters',
            'string.max': 'Task title cannot exceed 255 characters',
            'any.required': 'Task title is required'
        }),

    description: Joi.string()
        .max(2000)
        .allow('', null)
        .messages({
            'string.max': 'Description cannot exceed 2000 characters'
        }),
    status: Joi.string()
        .valid('active', 'completed', 'archived')
        .default('pending')
        .messages({ 
            'any.only': 'Status must be one of: active, completed, archived'
        }),
        priority: Joi.string()
        .valid('low', 'medium', 'high')
        .default('medium')
        .messages({
            'any.only': 'Priority must be one of: low, medium, high'
        }),
    dueDate: Joi.date()
        .greater('now')
        .messages({
            'date.greater': 'Due date must be in the future'
        })
});


export const validateCreateTask = (req, res, next) => {
    const { error, value } = createTaskSchema.validate(req.body, {
        abortEarly: false
    });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return next(new AppError(errors.join(', '), 400));
    }
    req.body = value;
    next();
};


export const validateUpdateTask = (req, res, next) => {
    const updateTaskSchema = Joi.object({
        title: Joi.string().min(3).max(255),
        description: Joi.string().max(2000).allow('', null),
        status: Joi.string().valid('active', 'completed', 'archived'),
        priority: Joi.string().valid('low', 'medium', 'high'),
        dueDate: Joi.date().greater('now')
    });
    const { error, value } = updateTaskSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return next(new AppError(errors.join(', '), 400));
    }
    req.body = value;
    next();
};