import { ApiError } from '../utils/ApiError.js';

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized: User not authenticated.'));
    }

    const userRole = req.user.role === 'faculty' ? 'staff' : req.user.role;
    const normalizedAllowed = allowedRoles.map((r) => (r === 'faculty' ? 'staff' : r));

    if (!normalizedAllowed.includes(userRole)) {
      return next(
        new ApiError(
          403,
          `Access Denied: Role '${req.user.role}' is not authorized to access this resource. Required role: ${allowedRoles.join(' or ')}.`
        )
      );
    }

    next();
  };
};
