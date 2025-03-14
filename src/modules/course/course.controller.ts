import { JsonController, Get, Post, Delete, Param, Body, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CourseService } from './course.service';
import { authMiddleware, adminMiddleware } from '../../middlewares/auth';
import { Course } from './course.entity';

@JsonController('/courses')
@OpenAPI({ tags: ['Courses'] })
export class CourseController {
  private courseService = CourseService.getInstance();

  @Get('/')
  @UseBefore(authMiddleware)
  async getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get('/:id')
  @UseBefore(authMiddleware)
  async getCourseById(@Param('id') id: number) {
    return this.courseService.getCourseById(id);
  }

  @Post('/')
  @UseBefore(authMiddleware)
  async createCourse(@Body() courseData: Partial<Course>) {
    return this.courseService.createCourse(courseData);
  }

  @Delete('/:id')
  @UseBefore(authMiddleware, adminMiddleware)
  async deleteCourse(@Param('id') id: number) {
    return this.courseService.deleteCourse(id);
  }
}