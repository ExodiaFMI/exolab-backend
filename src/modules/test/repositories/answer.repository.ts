import { Repository } from "typeorm";
import { Answer } from "../entities/answer.entity";
import AppDataSource from "../../../config/database";

export class AnswerRepository {
  private static instance: AnswerRepository;
  private repo: Repository<Answer>;

  private constructor(repo: Repository<Answer>) {
    this.repo = repo;
  }

  static getInstance(): AnswerRepository {
    if (!AnswerRepository.instance) {
      AnswerRepository.instance = new AnswerRepository(AppDataSource.getRepository(Answer));
    }
    return AnswerRepository.instance;
  }

  async findByQuestion(questionId: number): Promise<Answer[]> {
    return this.repo.find({ where: { question: { id: questionId } } });
  }

  async createAnswer(answerData: Partial<Answer>): Promise<Answer> {
    const answer = this.repo.create(answerData);
    return this.repo.save(answer);
  }

  async deleteAnswer(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
