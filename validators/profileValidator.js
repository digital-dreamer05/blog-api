const yup = require('yup');

const updateProfileSchema = yup.object({
  name: yup.string().max(255, 'Name must be at most 255 characters').optional(),

  bio: yup.string().max(500, 'Bio must be at most 500 characters').optional(),

  website: yup
    .string()
    .url('Invalid website URL')
    .max(255, 'Website URL must be at most 255 characters')
    .optional(),

  location: yup
    .string()
    .max(100, 'Location must be at most 100 characters')
    .optional(),
});

module.exports = updateProfileSchema;
