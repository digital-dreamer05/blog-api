const { User } = require('../db');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username }, raw: true });

    if (!user) {
      return done(null, false, { message: 'Invalid username or password.' });
    }

    if (!user.isVerified) {
      return done(null, false, {
        message: 'Please verify your email before logging in.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return done(null, false, { message: 'Invalid username or password.' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
