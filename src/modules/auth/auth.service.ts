import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { LoginDto } from './auth.dto';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export class AuthService {
  private userRepo = UserRepository.getInstance();

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findByEmail(loginDto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return { token };
  }
}
