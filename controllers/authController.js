const catchAsync = require('../utils/catchAsync');
const { sendVerificationEmail } = require('../utils/email');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../configs');
const { User } = require('../db');
const redis = require('../redis');
const { Op } = require('sequelize');
const crypto = require('crypto');

exports.register = catchAsync(async (req, res, next) => {
  const { name, username, email, password } = req.body;

  // 1. check if user exists (email or username)
  const existingUserByEmail = await User.findOne({ where: { email } });
  const existingUserByUsername = await User.findOne({ where: { username } });

  if (existingUserByEmail) {
    return res
      .status(409)
      .json({ message: 'This email is already registered. Please login.' });
  }

  if (existingUserByUsername) {
    return res.status(409).json({
      message: 'This username is already taken. Please choose another one.',
    });
  }

  // 2. create user (isVerified = false)
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
    isVerified: false,
  });

  // 3. generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(`otp:${newUser.id}`, otp, 'EX', 600);

  await sendVerificationEmail(newUser.email, otp);

  return res.status(201).json({
    message:
      'Registration successful. Please check your email for the verification code.',
  });
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.isVerified) {
    return res.status(400).json({ message: 'User already verified' });
  }

  const storedOtp = await redis.get(`otp:${user.id}`);
  if (!storedOtp) {
    return res.status(400).json({ message: 'OTP expired or not found' });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  await user.update({ isVerified: true });

  await redis.del(`otp:${user.id}`);

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    config.auth.accessTokenSecretKey,
    { expiresIn: `${config.auth.accessTokenExpiresInSeconds}s` }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    config.auth.refreshTokenSecretKey,
    { expiresIn: `${config.auth.refreshTokenExpiresInSeconds}s` }
  );

  await redis.set(
    `refreshToken:${user.id}`,
    await bcrypt.hash(refreshToken, 12),
    'EX',
    config.auth.refreshTokenExpiresInSeconds
  );

  return res.status(200).json({
    message: 'Email verified successfully',
    accessToken,
    refreshToken,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const user = req.user;

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    config.auth.accessTokenSecretKey,
    { expiresIn: `${config.auth.accessTokenExpiresInSeconds}s` }
  );

  const refreshToken = jwt.sign(
    { id: user.id, tokenVersion: user.tokenVersion },
    config.auth.refreshTokenSecretKey,
    { expiresIn: `${config.auth.refreshTokenExpiresInSeconds}s` }
  );

  const hashedRefreshToken = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  await redis.set(
    `refreshToken:${user.id}`,
    hashedRefreshToken,
    'EX',
    config.auth.refreshTokenExpiresInSeconds
  );

  if (req.query.redirect === 'web' || req.path.includes('google/callback')) {
    return res.redirect(`/auth-success?accessToken=${accessToken}`);
  }

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: config.auth.refreshTokenExpiresInSeconds * 1000,
  });

  return res.status(200).json({ accessToken });
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

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { isVerified: true },
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json(users);
});

exports.logout = catchAsync(async (req, res, next) => {
  const redisKey = `refreshToken:${req.user.id}`;

  await redis.del(redisKey);

  return res.status(200).json({ message: 'User logout successfully' });
});
