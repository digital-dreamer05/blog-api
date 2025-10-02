const yup = require('yup');

const signupSchema = yup.object({
  name: yup
    .string()
    .max(255, 'Name must be at most 255 characters')
    .required('Name is required'),

  username: yup
    .string()
    .min(5, 'Username must be at least 5 characters')
    .max(255, 'Username must be at most 255 characters')
    .matches(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/, 'Username is not valid')
    .required('Username is required'),

  email: yup
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be at most 255 characters')
    .required('Email is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
});

module.exports = signupSchema;
