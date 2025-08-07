const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const passport = require('passport');

const localStrategy = require('./passport/localStrategy');
const captchaController = require('./controllers/captchaController');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();

app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(passport.initialize());

app.use(localStrategy);

app.get('/captcha', captchaController.getCaptcha);
app.get('/auth', authRoutes);
app.get('/articles', articleRoutes);

module.exports = app;
