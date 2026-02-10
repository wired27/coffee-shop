const Joi = require('joi');

const createMenuItemSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required',
  }),
  description: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  }),
  category: Joi.string()
    .valid('hot', 'cold', 'pastry', 'snack')
    .required()
    .messages({
      'any.only': 'Category must be hot, cold, pastry, or snack',
      'any.required': 'Category is required',
    }),
  image: Joi.string().trim().uri().allow('').messages({
    'string.uri': 'Image must be a valid URL',
  }),
  available: Joi.boolean(),
});

const updateMenuItemSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).messages({
    'string.empty': 'Name cannot be empty',
    'string.max': 'Name cannot exceed 100 characters',
  }),
  description: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  price: Joi.number().min(0).messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
  }),
  category: Joi.string().valid('hot', 'cold', 'pastry', 'snack').messages({
    'any.only': 'Category must be hot, cold, pastry, or snack',
  }),
  image: Joi.string().trim().uri().allow('').messages({
    'string.uri': 'Image must be a valid URL',
  }),
  available: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required to update',
  });

module.exports = { createMenuItemSchema, updateMenuItemSchema };
