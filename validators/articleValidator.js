const yup = require('yup');

const articleSchema = yup.object({
  title: yup
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters')
    .required('Title is required'),

  content: yup
    .string()
    .min(1, 'Content is required')
    .required('Content is required'),

  tags: yup
    .array()
    .of(yup.string().min(1, 'Tag cannot be empty'))
    .min(1, 'At least one tag is required')
    .required('Tags are required'),
});

module.exports = articleSchema;
