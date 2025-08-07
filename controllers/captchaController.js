const redis = require('../redis');

exports.getCaptcha = async (req, res, next) => {
  const captcha = await redis.get('captcha');
  res.render('captcha', { captcha });
};
