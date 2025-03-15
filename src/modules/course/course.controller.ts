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
  @OpenAPI({
    summary: 'Get all courses',
    description: 'Returns a list of all available courses.',
    responses: { '200': { description: 'List of courses', type: 'array', items: { $ref: '#/components/schemas/CourseResponseDto' } } }
  })
  async getAllCourses() {
    const courses = await this.courseService.getAllCourses();
    return courses.map(course => new CourseResponseDto(course));
  }

  @Get('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Get course by ID',
    description: 'Returns a single course by its ID.',
    responses: { '200': { description: 'Course details', type: 'object', $ref: '#/components/schemas/CourseResponseDto' } }
  })
  async getCourseById(@Param('id') id: number) {
    const course = await this.courseService.getCourseById(id);
    return course ? new CourseResponseDto(course) : null;
  }

  @Get('/user/:userId')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Get courses by user ID',
    description: 'Returns all courses created by a specific user.',
    responses: { '200': { description: 'List of user courses', type: 'array', items: { $ref: '#/components/schemas/CourseResponseDto' } } }
  })
  async getCoursesByUser(@Param('userId') userId: number) {
    const courses = await this.courseService.getCoursesByUserId(userId);
    return courses.map(course => new CourseResponseDto(course));
  }

  @Post('/')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Create a new course',
    description: 'Creates a new course and returns the created entity.',
    requestBody: { description: 'Course creation data', required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCourseDto' } } } },
    responses: { '201': { description: 'Course created successfully', type: 'object', $ref: '#/components/schemas/CourseResponseDto' } }
  })
  async createCourse(@Body() courseData: CreateCourseDto) {
    const course = await this.courseService.createCourse(courseData);
    return new CourseResponseDto(course);
  }

  @Delete('/:id')
  @UseBefore(authMiddleware, adminMiddleware)
  @OpenAPI({
    summary: 'Delete a course',
    description: 'Deletes a course by its ID. Requires admin privileges.',
    responses: { '200': { description: 'Course deleted successfully' }, '404': { description: 'Course not found' } }
  })
  async deleteCourse(@Param('id') id: number) {
    return this.courseService.deleteCourse(id);
  }
}
