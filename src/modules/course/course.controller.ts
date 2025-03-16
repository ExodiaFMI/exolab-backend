import { JsonController, Get, Post, Delete, Param, Body, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CourseService } from './course.service';
import { authMiddleware, adminMiddleware } from '../../middlewares/auth';
import { CreateCourseDto, CourseResponseDto } from './course.dto';

@JsonController('/courses')
@OpenAPI({ tags: ['Courses'] })
export class CourseController {
  private courseService = CourseService.getInstance();

  @Get('/')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Get all courses',
    description: 'Returns a list of all available courses.',
    responses: {
      '200': {
        description: 'List of courses',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/CourseResponseDto' }
            }
          }
        }
      },
      '401': { description: 'Unauthorized' },
      '500': { description: 'Internal Server Error' }
    }
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
    responses: {
      '200': {
        description: 'Course details',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CourseResponseDto' }
          }
        }
      },
      '401': { description: 'Unauthorized' },
      '404': { description: 'Course not found' },
      '500': { description: 'Internal Server Error' }
    }
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
    responses: {
      '200': {
        description: 'List of user courses',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/CourseResponseDto' }
            }
          }
        }
      },
      '401': { description: 'Unauthorized' },
      '404': { description: 'User not found or no courses available' },
      '500': { description: 'Internal Server Error' }
    }
  })
  async getCoursesByUser(@Param('userId') userId: number) {
    const courses = await this.courseService.getCoursesByUserId(userId);
    return courses.map(course => new CourseResponseDto(course));
  }

  @Post('/')
  //@UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Create a new course',
    description: 'Creates a new course and returns the created entity.',
    requestBody: {
      description: 'Course creation data',
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/CreateCourseDto' }
        }
      }
    },
    responses: {
      '201': {
        description: 'Course created successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CourseResponseDto' }
          }
        }
      },
      '400': { description: 'Invalid request data' },
      '401': { description: 'Unauthorized' },
      '500': { description: 'Internal Server Error' }
    }
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
    responses: {
      '200': { description: 'Course deleted successfully' },
      '401': { description: 'Unauthorized' },
      '403': { description: 'Forbidden - Admins only' },
      '404': { description: 'Course not found' },
      '500': { description: 'Internal Server Error' }
    }
  })
  async deleteCourse(@Param('id') id: number) {
    return this.courseService.deleteCourse(id);
  }
}
