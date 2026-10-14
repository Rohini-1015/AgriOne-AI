import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required before accessing this resource.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted. Role '${req.user.role}' is not authorized for this action. Allowed: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};
