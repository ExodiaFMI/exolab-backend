import { UserTestResultRepository } from "../repositories/results.repository";
import { UserTestResult } from "../entities/results.entity";

export class UserTestResultService {
  private static instance: UserTestResultService;
  private resultRepo: UserTestResultRepository;

  private constructor(resultRepo: UserTestResultRepository) {
    this.resultRepo = resultRepo;
  }

  static getInstance(): UserTestResultService {
    if (!UserTestResultService.instance) {
      UserTestResultService.instance = new UserTestResultService(UserTestResultRepository.getInstance());
    }
    return UserTestResultService.instance;
  }

  async getResultsByUser(userId: number): Promise<UserTestResult[]> {
    return this.resultRepo.findResultsByUser(userId);
  }

  async createResult(resultData: Partial<UserTestResult>): Promise<UserTestResult> {
    return this.resultRepo.createResult(resultData);
  }

  async deleteResult(id: number): Promise<void> {
    await this.resultRepo.deleteResult(id);
  }
}
