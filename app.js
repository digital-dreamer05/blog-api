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

const pageController = require('./controllers/pageController');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

// Page Routes (EJS)

app.use('/hi', (req, res) => {
  res.render('home');
});

app.get('/login', pageController.loginPage);
app.get('/register', pageController.registerPage);
app.get('/auth-success', (req, res) => {
  res.render('auth-success');
});

app.get('/create', pageController.createArticlePage);
app.get('/article/:slug', pageController.articleDetailPage);
app.get('/', pageController.homePage);

module.exports = app;
