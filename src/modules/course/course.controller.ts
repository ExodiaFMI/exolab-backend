import { JsonController, Get, Post, Body } from "routing-controllers";
import { CourseService } from "./course.service";
import { Course } from "./course.entity";

@JsonController("/courses")
export class CourseController {
    private courseService = new CourseService();

    @Get("/")
    async getAllCourses(): Promise<Course[]> {
        return this.courseService.getAllCourses();
    }

    @Post("/")
    async createCourse(@Body() courseData: Partial<Course>): Promise<Course> {
        return this.courseService.createCourse(courseData);
    }
}
