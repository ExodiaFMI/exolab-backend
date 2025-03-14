import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import AppDataSource from '../../config/database';

export class SubjectRepository {
  private static instance: SubjectRepository;
  private repo: Repository<Subject>;

  private constructor(repo: Repository<Subject>) {
    this.repo = repo;
  }

  static getInstance(): SubjectRepository {
    if (!SubjectRepository.instance) {
      SubjectRepository.instance = new SubjectRepository(AppDataSource.getRepository(Subject));
    }
    return SubjectRepository.instance;
  }

  async findAll(): Promise<Subject[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<Subject | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Subject | null> {
    return this.repo.findOne({ where: { name } });
  }

  async createSubject(subjectData: Partial<Subject>): Promise<Subject> {
    const subject = this.repo.create(subjectData);
    return this.repo.save(subject);
  }

  async deleteSubject(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}