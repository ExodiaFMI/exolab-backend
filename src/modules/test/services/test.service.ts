import { TestRepository } from "../repositories/test.repository";
import { Test } from "../entities/test.entity";

export class TestService {
  private static instance: TestService;
  private testRepo: TestRepository;

  private constructor(testRepo: TestRepository) {
    this.testRepo = testRepo;
  }

  static getInstance(): TestService {
    if (!TestService.instance) {
      TestService.instance = new TestService(TestRepository.getInstance());
    }
    return TestService.instance;
  }

  async getAllTests(): Promise<Test[]> {
    return this.testRepo.findAll();
  }

  async getTestById(id: number): Promise<Test | null> {
    return this.testRepo.findById(id);
  }

  async createTest(testData: Partial<Test>): Promise<Test> {
    return this.testRepo.createTest(testData);
  }

  async deleteTest(id: number): Promise<void> {
    await this.testRepo.deleteTest(id);
  }
}
