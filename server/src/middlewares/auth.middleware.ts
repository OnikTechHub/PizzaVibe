import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'pizzavibe_jwt_secret_dev_key_2026';

/**
 * Protect routes: requires a valid JWT Bearer token and verifies user from DB
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

/**
 * Database-Driven Role check: ensures the authenticated user's role is 'admin' in MongoDB
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Admin privileges required.',
    });
  }
  next();
};
