const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const signupSchema = require('../validators/signupValidato');
const loginSchema = require('../validators/loginValidator');
const passport = require('passport');
const captcha = require('../middlewares/captcha');

const router = express.Router();

router.route('/register').post(validate(signupSchema), authController.register);

router
  .route('/login')
  .post(
    validate(loginSchema),
    captcha,
    passport.authenticate('local', { session: false }),
    authController.login
  );

router
  .route('/me')
  .get(
    passport.authenticate('accessToken', { session: false }),
    authController.getMe
  );

router
  .route('/refresh')
  .post(
    passport.authenticate('refreshToken', { session: false }),
    authController.refreshToken
  );

router
  .route('/logout')
  .post(
    passport.authenticate('accessToken', { session: false }),
    authController.logout
  );

router
  .route('/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router
  .route('/google/callback')
  .get(
    passport.authenticate('google', { session: false }),
    authController.login
  );

module.exports = router;
