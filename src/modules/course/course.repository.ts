import { Repository } from 'typeorm';
import { Course } from './course.entity';
import AppDataSource from '../../config/database';

export class CourseRepository {
  private static instance: CourseRepository;
  private repo: Repository<Course>;

  private constructor(repo: Repository<Course>) {
    this.repo = repo;
  }

  static getInstance(): CourseRepository {
    if (!CourseRepository.instance) {
      CourseRepository.instance = new CourseRepository(AppDataSource.getRepository(Course));
    }
    return CourseRepository.instance;
  }

  async findAll(): Promise<Course[]> {
    return this.repo.find({ relations: ['subject'] });
  }

  async findById(id: number): Promise<Course | null> {
    return this.repo.findOne({ where: { id }, relations: ['subject'] });
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const course = this.repo.create(courseData);
    return this.repo.save(course);
  }

  async deleteCourse(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}