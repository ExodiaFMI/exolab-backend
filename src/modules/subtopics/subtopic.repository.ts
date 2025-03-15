import { Repository } from "typeorm";
import { Subtopic } from "./subtopic.entity";
import AppDataSource from "../../config/database";

export class SubtopicRepository {
  private static instance: SubtopicRepository;
  private repo: Repository<Subtopic>;

  private constructor(repo: Repository<Subtopic>) {
    this.repo = repo;
  }

  static getInstance(): SubtopicRepository {
    if (!SubtopicRepository.instance) {
      SubtopicRepository.instance = new SubtopicRepository(AppDataSource.getRepository(Subtopic));
    }
    return SubtopicRepository.instance;
  }

  async findAll(): Promise<Subtopic[]> {
    return this.repo.find({ relations: ["topic"] });
  }

  async findById(id: number): Promise<Subtopic | null> {
    return this.repo.findOne({ where: { id }, relations: ["topic"] });
  }

  async findByTopicId(topicId: number): Promise<Subtopic[]> {
    return this.repo.find({
      where: { topic: { id: topicId } },
      relations: ["topic"]
    });
  }

  async createSubtopic(subtopicData: Partial<Subtopic>): Promise<Subtopic> {
    const subtopic = this.repo.create(subtopicData);
    return this.repo.save(subtopic);
  }

  async deleteSubtopic(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
