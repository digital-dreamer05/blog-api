module.exports = (validator, path) => {
  return async (req, res, next) => {
    try {
      await validator.validate(req.body, {
        abortEarly: false,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.errors[0],
      });
    }
    next();
  };
};
