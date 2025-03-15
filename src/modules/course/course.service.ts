import { CourseRepository } from './course.repository';
import { Course } from './course.entity';

export class CourseService {
  private static instance: CourseService;
  private courseRepo: CourseRepository;

  private constructor(courseRepo: CourseRepository) {
    this.courseRepo = courseRepo;
  }

  static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService(CourseRepository.getInstance());
    }
    return CourseService.instance;
  }

  async getAllCourses(): Promise<Course[]> {
    return this.courseRepo.findAll();
  }

  async getCourseById(id: number): Promise<Course | null> {
    return this.courseRepo.findById(id);
  }

  async getCoursesByUserId(userId: number): Promise<Course[]> {
    return this.courseRepo.findByUserId(userId);
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    return this.courseRepo.createCourse(courseData);
  }

  async deleteCourse(id: number): Promise<void> {
    await this.courseRepo.deleteCourse(id);
  }
}
