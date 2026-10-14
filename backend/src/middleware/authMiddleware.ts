import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedRequest, AuthUser } from '../types';
import { dataStore } from '../services/dataStore';

export const authenticateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No Bearer token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string; email: string };

    const user = dataStore.users.find(u => u.id === decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid session. User account not found.',
      });
      return;
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      fullName: user.fullName,
      role: user.role,
      state: user.state,
      district: user.district,
      village: user.village,
      avatarUrl: user.avatarUrl,
    };

    req.user = authUser;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

export const optionalAuthJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
      const user = dataStore.users.find(u => u.id === decoded.id);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          mobileNumber: user.mobileNumber,
          fullName: user.fullName,
          role: user.role,
          state: user.state,
          district: user.district,
          village: user.village,
          avatarUrl: user.avatarUrl,
        };
      }
    }
    next();
  } catch (err) {
    // If token invalid in optional route, proceed without user
    next();
  }
};
