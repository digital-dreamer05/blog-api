module.exports = function validateYup(schema, path = 'body', options = {}) {
  const validateOptions = { abortEarly: false, ...options };

  function getTarget(req, dottedPath) {
    const parts = String(dottedPath || 'body').split('.');
    let cur = req;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  }

  function setTarget(req, dottedPath, value) {
    const parts = String(dottedPath || 'body').split('.');
    let cur = req;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (cur[p] == null) cur[p] = {};
      cur = cur[p];
    }
    cur[parts[parts.length - 1]] = value;
  }

  function formatYupError(err) {
    const payload = {
      errors: [],
      fieldErrors: {},
    };

    if (!err) return payload;

    if (Array.isArray(err.inner) && err.inner.length > 0) {
      for (const e of err.inner) {
        const p = e.path || '_global';
        payload.fieldErrors[p] = payload.fieldErrors[p] || [];
        payload.fieldErrors[p].push(e.message);
      }
    } else {
      const p = err.path || '_global';
      payload.fieldErrors[p] = payload.fieldErrors[p] || [];
      payload.fieldErrors[p].push(err.message);
    }

    payload.errors = Object.keys(payload.fieldErrors).map((path) => ({
      path,
      messages: payload.fieldErrors[path],
    }));

    return payload;
  }

  return async (req, res, next) => {
    try {
      const target = getTarget(req, path);

      const validated = await schema.validate(target, validateOptions);

      setTarget(req, path, validated);

      return next();
    } catch (err) {
      if (err && err.name === 'ValidationError') {
        const formatted = formatYupError(err);
        return res.status(400).json({
          message: 'Validation failed',
          errors: formatted.errors,
          fieldErrors: formatted.fieldErrors,
        });
      }

      return next(err);
    }
  };
};
