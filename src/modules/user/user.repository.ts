import { Repository } from 'typeorm';
import { User } from './user.entity';
import AppDataSource from '../../config/database';

export class UserRepository {
  private static instance: UserRepository;
  private repo: Repository<User>;

  private constructor(repo: Repository<User>) {
    this.repo = repo;
  }

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository(AppDataSource.getRepository(User));
    }
    return UserRepository.instance;
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
