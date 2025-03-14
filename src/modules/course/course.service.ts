import { CourseRepository } from "./course.repository";
import { Course } from "./course.entity";

export class CourseService {
    async getAllCourses(): Promise<Course[]> {
        return CourseRepository.find({ relations: ["subject"] });
    }

    async createCourse(courseData: Partial<Course>): Promise<Course> {
        const course = CourseRepository.create(courseData);
        return CourseRepository.save(course);
    }
}