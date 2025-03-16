import { Repository } from "typeorm";
import { Question } from "../entities/question.entity";
import AppDataSource from "../../../config/database";

export class QuestionRepository {
  private static instance: QuestionRepository;
  private repo: Repository<Question>;

  private constructor(repo: Repository<Question>) {
    this.repo = repo;
  }

  static getInstance(): QuestionRepository {
    if (!QuestionRepository.instance) {
      QuestionRepository.instance = new QuestionRepository(AppDataSource.getRepository(Question));
    }
    return QuestionRepository.instance;
  }

  async findAll(): Promise<Question[]> {
    return this.repo.find({ relations: ["test", "subtopic"] });
  }

  async findByTest(testId: number): Promise<Question[]> {
    return this.repo.find({ where: { test: { id: testId } }, relations: ["subtopic"] });
  }

  async createQuestion(questionData: Partial<Question>): Promise<Question> {
    const question = this.repo.create(questionData);
    return this.repo.save(question);
  }

  async deleteQuestion(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
