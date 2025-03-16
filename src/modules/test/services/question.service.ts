import { QuestionRepository } from "../repositories/question.repository";
import { Question } from "../entities/question.entity";

export class QuestionService {
  private static instance: QuestionService;
  private questionRepo: QuestionRepository;

  private constructor(questionRepo: QuestionRepository) {
    this.questionRepo = questionRepo;
  }

  static getInstance(): QuestionService {
    if (!QuestionService.instance) {
      QuestionService.instance = new QuestionService(QuestionRepository.getInstance());
    }
    return QuestionService.instance;
  }

  async getAllQuestions(): Promise<Question[]> {
    return this.questionRepo.findAll();
  }

  async getQuestionsByTest(testId: number): Promise<Question[]> {
    return this.questionRepo.findByTest(testId);
  }

  async createQuestion(questionData: Partial<Question>): Promise<Question> {
    return this.questionRepo.createQuestion(questionData);
  }

  async deleteQuestion(id: number): Promise<void> {
    await this.questionRepo.deleteQuestion(id);
  }
}
