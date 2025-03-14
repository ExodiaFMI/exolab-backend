import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('🔒 Authentication check');
  next();
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('👑 Checking if the user is an administrator');

  const isAdmin = false;

  if (!isAdmin) {
    res.status(403).json({ message: 'Insufficient permissions' });
    return;
  }

  next();
};
