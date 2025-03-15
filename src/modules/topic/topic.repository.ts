import { Repository } from 'typeorm';
import { Topic } from './topic.entity';
import AppDataSource from '../../config/database';

export class TopicRepository {
  private static instance: TopicRepository;
  private repo: Repository<Topic>;

  private constructor(repo: Repository<Topic>) {
    this.repo = repo;
  }

  static getInstance(): TopicRepository {
    if (!TopicRepository.instance) {
      TopicRepository.instance = new TopicRepository(AppDataSource.getRepository(Topic));
    }
    return TopicRepository.instance;
  }

  async findAll(): Promise<Topic[]> {
    return this.repo.find({ relations: ['course'] });
  }

  async findById(id: number): Promise<Topic | null> {
    return this.repo.findOne({ where: { id }, relations: ['course'] });
  }

  async createTopic(topicData: Partial<Topic>): Promise<Topic> {
    const topic = this.repo.create(topicData);
    return this.repo.save(topic);
  }

  async deleteTopic(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
