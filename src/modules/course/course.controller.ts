import { JsonController, Get, Post, Delete, Param, Body, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CourseService } from './course.service';
import { authMiddleware, adminMiddleware } from '../../middlewares/auth';
import { CreateCourseDto } from './course.dto';
import { CourseResponseDto } from './course.dto';

@JsonController('/courses')
@OpenAPI({ tags: ['Courses'] })
export class CourseController {
  private courseService = CourseService.getInstance();

  @Get('/')
  @UseBefore(authMiddleware)
  async getAllCourses() {
    const courses = await this.courseService.getAllCourses();
    return courses.map(course => new CourseResponseDto(course));
  }

  @Get('/:id')
  @UseBefore(authMiddleware)
  async getCourseById(@Param('id') id: number) {
    const course = await this.courseService.getCourseById(id);
    return course ? new CourseResponseDto(course) : null;
  }

  @Get('/user/:userId')
  @UseBefore(authMiddleware)
  async getCoursesByUser(@Param('userId') userId: number) {
    return this.courseService.getCoursesByUserId(userId);
  }

  @Post('/')
  @UseBefore(authMiddleware)
  async createCourse(@Body() courseData: CreateCourseDto) {
    return this.courseService.createCourse(courseData);
  }
  

  @Delete('/:id')
  @UseBefore(authMiddleware, adminMiddleware)
  async deleteCourse(@Param('id') id: number) {
    return this.courseService.deleteCourse(id);
  }
}
