const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../configs');
const { User } = require('../db');
const redis = require('../redis');

exports.register = catchAsync(async (req, res, next) => {
  const { name, username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  const accessToken = jwt.sign(
    { id: newUser.id, role: newUser.role },
    config.auth.accessTokenSecretKey,
    {
      expiresIn: config.auth.accessTokenExpiresInSeconds + 's',
    }
  );

  const refreshToken = jwt.sign(
    { id: newUser.id },
    config.auth.refreshTokenSecretKey,
    {
      expiresIn: config.auth.refreshTokenExpiresInSeconds + 's',
    }
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

  await redis.set(
    `refreshToken:${newUser.id}`,
    hashedRefreshToken,
    'EX',
    config.auth.refreshTokenExpiresInSeconds
  );

  return res.status(201).json({
    accessToken,
    refreshToken,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const newUser = req.user;

  const accessToken = jwt.sign(
    { id: newUser.id, role: newUser.role },
    config.auth.accessTokenSecretKey,
    {
      expiresIn: config.auth.accessTokenExpiresInSeconds + 's',
    }
  );

  const refreshToken = jwt.sign(
    { id: newUser.id },
    config.auth.refreshTokenSecretKey,
    {
      expiresIn: config.auth.refreshTokenExpiresInSeconds + 's',
    }
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

  await redis.set(
    `refreshToken:${newUser.id}`,
    hashedRefreshToken,
    'EX',
    config.auth.refreshTokenExpiresInSeconds
  );

  return res.status(200).json({
    accessToken,
    refreshToken,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = req.user;

  return res.status(200).json(user);
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const user = req.user;

  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.auth.accessTokenSecretKey,
    {
      expiresIn: config.auth.accessTokenExpiresInSeconds + 's',
    }
  );

  return res.json({ accessToken });
});

exports.logout = catchAsync(async (req, res, next) => {
  const redisKey = `refreshToken:${req.user.id}`;

  await redis.del(redisKey);

  return res.status(200).json({ message: 'User logout successfully' });
});
