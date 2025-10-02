const redis = require('../redis');

module.exports = async (req, res, next) => {
  const { captchaUuid, captcha } = req.body;

  const cashedCaptcha = await redis.get(`captcha:${captchaUuid}`);

  if (cashedCaptcha) {
    await redis.del(`captcha:${captchaUuid}`);
  }

  if (cashedCaptcha !== captcha.toLowerCase()) {
    return res.status(401).json({
      message: 'Invalid captcha',
    });
  }

  next();
};
