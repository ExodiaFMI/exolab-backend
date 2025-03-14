import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN: number = parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10);

export class AuthService {
    static generateToken(userId: string): string {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
    }

    static verifyToken(token: string): { userId: string } | null {
        try {
            return jwt.verify(token, JWT_SECRET) as { userId: string };
        } catch {
            return null;
        }
    }
}
