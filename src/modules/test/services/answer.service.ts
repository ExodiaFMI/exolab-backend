import { AnswerRepository } from "../repositories/answer.repository";
import { Answer } from "../entities/answer.entity";

export class AnswerService {
  private static instance: AnswerService;
  private answerRepo: AnswerRepository;

  private constructor(answerRepo: AnswerRepository) {
    this.answerRepo = answerRepo;
  }

  static getInstance(): AnswerService {
    if (!AnswerService.instance) {
      AnswerService.instance = new AnswerService(AnswerRepository.getInstance());
    }
    return AnswerService.instance;
  }

  async getAnswersByQuestion(questionId: number): Promise<Answer[]> {
    return this.answerRepo.findByQuestion(questionId);
  }

  async createAnswer(answerData: Partial<Answer>): Promise<Answer> {
    return this.answerRepo.createAnswer(answerData);
  }

  async deleteAnswer(id: number): Promise<void> {
    await this.answerRepo.deleteAnswer(id);
  }
}
