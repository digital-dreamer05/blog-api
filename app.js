const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const passport = require('passport');

const localStrategy = require('./strategies/localStrategy');
const captchaController = require('./controllers/captchaController');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const jwtAccessTokenStrategy = require('./strategies/jwtAccessTokenStrategy');
const jwtRefreshTokenStrategy = require('./strategies/jwtRefreshTokenStrategy');
const googleStrategy = require('./strategies/googleStrategy');

const app = express();

// app.use(cors());
app.use(
  cors({ origin: ['https://your-frontend.site', 'http://localhost:5173'] })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(passport.initialize());

passport.use(localStrategy);
passport.use('accessToken', jwtAccessTokenStrategy);
passport.use('refreshToken', jwtRefreshTokenStrategy);
passport.use(googleStrategy);

// API routes
app.get('/captcha', captchaController.getCaptcha);
app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);

// Optional: basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Fallback 404 for unknown API routes (not matching static files)
app.use((req, res, next) => {
  if (
    req.path.startsWith('/auth') ||
    req.path.startsWith('/articles') ||
    req.path.startsWith('/captcha')
  ) {
    return res.status(404).json({ message: 'Not found' });
  }
  return next();
});

module.exports = app;
