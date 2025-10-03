// utils/responseHandler.js
const handleAuthResponse = (req, res, statusCode, data) => {
  const isWebRedirect =
    req.query.redirect === 'web' || req.path.includes('google/callback');

  if (isWebRedirect) {
    if (data.error) {
      return res.redirect(
        `/auth-failed?message=${encodeURIComponent(data.message)}`
      );
    }

    const { accessToken, refreshToken } = data;
    return res.redirect(
      `/auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }

  return res.status(statusCode).json(data);
};

module.exports = { handleAuthResponse };

// ====================================================

// controllers/authController.js
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../configs');
const { User } = require('../db');
const redis = require('../redis');
const { Op } = require('sequelize');
const { handleAuthResponse } = require('../utils/responseHandler');

// Helper function to generate tokens
const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    config.auth.accessTokenSecretKey,
    { expiresIn: config.auth.accessTokenExpiresInSeconds + 's' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    config.auth.refreshTokenSecretKey,
    { expiresIn: config.auth.refreshTokenExpiresInSeconds + 's' }
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

  await redis.set(
    `refreshToken:${user.id}`,
    hashedRefreshToken,
    'EX',
    config.auth.refreshTokenExpiresInSeconds
  );

  return { accessToken, refreshToken };
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, username, email, password } = req.body;

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });

  if (existingUser) {
    return handleAuthResponse(req, res, 409, {
      error: true,
      message: 'User already registered. Please login',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  const tokens = await generateTokens(newUser);

  return handleAuthResponse(req, res, 201, tokens);
});

exports.login = catchAsync(async (req, res, next) => {
  const newUser = req.user;

  const tokens = await generateTokens(newUser);

  return handleAuthResponse(req, res, 200, tokens);
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  return res.status(200).json(user);
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const user = req.user;

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    config.auth.accessTokenSecretKey,
    { expiresIn: config.auth.accessTokenExpiresInSeconds + 's' }
  );

  return res.json({ accessToken });
});

exports.logout = catchAsync(async (req, res, next) => {
  await redis.del(`refreshToken:${req.user.id}`);
  return res.status(200).json({ message: 'User logout successfully' });
});
