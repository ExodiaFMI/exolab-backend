import { UserRepository } from './user.repository';
import { User } from './user.entity';

export class UserService {
  private static instance: UserService;
  private userRepo: UserRepository;

  private constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService(UserRepository.getInstance());
    }
    return UserService.instance;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async registerUser(userData: Partial<User>): Promise<User> {
    return this.userRepo.createUser(userData);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepo.deleteUser(id);
  }
}
