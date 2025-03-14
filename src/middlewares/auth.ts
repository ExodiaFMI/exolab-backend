import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
interface AuthenticatedRequest extends Request {
  user?: { userId: number };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  console.log('🔐 Checking if the user is authenticated');
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
      req.user = { userId: decoded.userId as number };
      return next();
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('👑 Checking if the user is an administrator');

  const isAdmin = false;

  if (!isAdmin) {
    res.status(403).json({ message: 'Insufficient permissions' });
    return;
  }

  next();
};
