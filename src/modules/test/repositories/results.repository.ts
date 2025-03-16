import { Repository } from "typeorm";
import { UserTestResult } from "../entities/results.entity";
import AppDataSource from "../../../config/database";

export class UserTestResultRepository {
  private static instance: UserTestResultRepository;
  private repo: Repository<UserTestResult>;

  private constructor(repo: Repository<UserTestResult>) {
    this.repo = repo;
  }

  static getInstance(): UserTestResultRepository {
    if (!UserTestResultRepository.instance) {
      UserTestResultRepository.instance = new UserTestResultRepository(AppDataSource.getRepository(UserTestResult));
    }
    return UserTestResultRepository.instance;
  }

  async findResultsByUser(userId: number): Promise<UserTestResult[]> {
    return this.repo.find({ where: { user: { id: userId } }, relations: ["test"] });
  }

  async createResult(resultData: Partial<UserTestResult>): Promise<UserTestResult> {
    const result = this.repo.create(resultData);
    return this.repo.save(result);
  }

  async deleteResult(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
