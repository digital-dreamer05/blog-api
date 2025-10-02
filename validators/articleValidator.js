const yup = require('yup');

const articleSchema = yup.object().shape({
  title: yup.string().max(255).required(),
  content: yup.string().required(),
  tags: yup
    .mixed()
    .test('is-string-or-array', 'Tags must be string or array', (value) => {
      return (
        typeof value === 'string' ||
        (Array.isArray(value) &&
          value.every((item) => typeof item === 'string'))
      );
    })
    .required('Tags are required'),
});

module.exports = articleSchema;
