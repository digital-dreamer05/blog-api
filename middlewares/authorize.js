/**
 * Role-based authourization middleware factory
 *
 * @param {string|string[]} allowedRoles - list of roles that can access the route
 *   Example: 'admin' or ['admin', 'supervisor']
 *   If omitted -> just requires authentication (no role restriction)
 */
function authorize(allowedRoles) {
  // normalize roles: convert single string to array
  let roles = null;
  if (allowedRoles) {
    roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  }

  return (req, res, next) => {
    // 1) Must be authenticated (passport should have set req.user)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 2) If roles restriction exists, check role
    if (roles && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    next();
  };
}

module.exports = authorize;
