import { Repository } from "typeorm";
import { Test } from "../entities/test.entity";
import AppDataSource from "../../../config/database";

export class TestRepository {
  private static instance: TestRepository;
  private repo: Repository<Test>;

  private constructor(repo: Repository<Test>) {
    this.repo = repo;
  }

  static getInstance(): TestRepository {
    if (!TestRepository.instance) {
      TestRepository.instance = new TestRepository(AppDataSource.getRepository(Test));
    }
    return TestRepository.instance;
  }

  async findAll(): Promise<Test[]> {
    return this.repo.find({ relations: ["questions"] });
  }

  async findById(id: number): Promise<Test | null> {
    return this.repo.findOne({ where: { id }, relations: ["questions"] });
  }

  async createTest(testData: Partial<Test>): Promise<Test> {
    const test = this.repo.create(testData);
    return this.repo.save(test);
  }

  async deleteTest(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
