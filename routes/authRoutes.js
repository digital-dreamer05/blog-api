const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const signupSchema = require('../validators/signupValidator');
const loginSchema = require('../validators/loginValidator');
const captcha = require('../middlewares/captcha');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.route('/register').post(validate(signupSchema), authController.register);

router.route('/verify-otp').post(authController.verifyOtp);

router.post(
  '/login',
  validate(loginSchema),
  captcha,
  (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: info?.message || 'Login failed.',
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  },
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

router.get(
  '/users',
  passport.authenticate('accessToken', { session: false }),
  authorize(['admin']),
  authController.getAllUsers
);

module.exports = router;
