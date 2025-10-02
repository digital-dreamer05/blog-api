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

app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(passport.initialize());

passport.use(localStrategy);
passport.use('accessToken', jwtAccessTokenStrategy);
passport.use('refreshToken', jwtRefreshTokenStrategy);
passport.use(googleStrategy);

app.get('/captcha', captchaController.getCaptcha);
app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);
app.use('/hi', (req, res) => {
  res.render('home');
});
app.use('/auth/login', (req, res) => {
  res.render('login');
});

module.exports = app;
