import { CourseRepository } from './course.repository';
import { Course } from './course.entity';
import { CreateCourseDto } from './course.dto';
import { UserService } from '../user/user.service';
import { SubjectRepository } from '../subject/subject.repository';
import { TopicService } from '../topic/topic.service';

export class CourseService {
  private static instance: CourseService;
  private courseRepo: CourseRepository;
  private userService: UserService;
  private subjectRepo: SubjectRepository;

  private constructor(courseRepo: CourseRepository, userService: UserService, subjectRepo: SubjectRepository) {
    this.courseRepo = courseRepo;
    this.userService = userService;
    this.subjectRepo = subjectRepo;
  }

  static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService(
        CourseRepository.getInstance(),
        UserService.getInstance(),
        SubjectRepository.getInstance()
      );
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

  async createCourse(courseData: CreateCourseDto): Promise<Course> {
    const subject = await this.subjectRepo.findById(courseData.subjectId);
    if (!subject) {
        throw new Error(`Subject with ID ${courseData.subjectId} not found`);
    }

    const owner = await this.userService.getUserById(courseData.ownerId);
    if (!owner) {
        throw new Error(`User with ID ${courseData.ownerId} not found`);
    }

    const newCourse = await this.courseRepo.createCourse({
        ...courseData,
        subject,
        owner
    });

    await TopicService.getInstance().generateTopicsForCourse(newCourse);

    return newCourse;
}

  async deleteCourse(id: number): Promise<void> {
    await this.courseRepo.deleteCourse(id);
  }
}
