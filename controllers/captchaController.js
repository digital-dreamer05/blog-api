const uuidv4 = require('uuid').v4;
const redis = require('../redis');
const svgCaptcha = require('svg-captcha');

exports.getCaptcha = async (req, res, next) => {
  const captcha = svgCaptcha.create({
    size: 4,
    noise: 5,
    color: true,
  });

  const uuid = uuidv4();

  await redis.set(`captcha:${uuid}`, captcha.text.toLowerCase(), 'ex', 60 * 5);

  res.json({
    uuid,
    captcha: captcha.data,
  });
};
