const Joi = require('joi');

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
  }),
  email: Joi.string().trim().email().messages({
    'string.email': 'Please enter a valid email',
  }),
  password: Joi.string().min(6).max(128).messages({
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password cannot exceed 128 characters',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field (name, email, or password) is required',
  });

module.exports = { updateProfileSchema };
