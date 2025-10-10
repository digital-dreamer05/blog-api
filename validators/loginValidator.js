const yup = require('yup');

const loginSchema = yup.object({
  username: yup
    .string()
    .min(5, 'Username must be at least 5 characters')
    .max(255, 'Username must be at most 255 characters')
    .matches(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/, 'Username is not valid')
    .required('Username is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),

  captchaUuid: yup.string().uuid().required(),
  captcha: yup
    .string()
    .max(4, 'Captcha must be at most 4 characters')
    .required('Captcha is required'),
});

module.exports = loginSchema;
