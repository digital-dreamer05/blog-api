const yup = require('yup');

const paginationSchema = yup.object({
  page: yup
    .number()
    .integer('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),

  limit: yup
    .number()
    .integer('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),

  search: yup
    .string()
    .max(255, 'Search term must be at most 255 characters')
    .optional(),

  sortBy: yup
    .string()
    .oneOf(['createdAt', 'updatedAt', 'title'], 'Invalid sort field')
    .default('createdAt'),

  sortOrder: yup
    .string()
    .oneOf(['ASC', 'DESC'], 'Sort order must be ASC or DESC')
    .default('DESC'),
});

module.exports = paginationSchema;
