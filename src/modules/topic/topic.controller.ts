import { JsonController, Get, Param, UseBefore, Req } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { TopicService } from './topic.service';
import { authMiddleware } from '../../middlewares/auth';
import { TopicResponseDto } from './topic.dto';

@JsonController('/topics')
@OpenAPI({ tags: ['Topics'] })
export class TopicController {
  private topicService = TopicService.getInstance();

  @Get('/course/:courseId')
  @OpenAPI({
    summary: 'Get topics by course ID',
    description: 'Returns all topics for a given course.',
    responses: {
      '200': {
        description: 'List of topics',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/TopicResponseDto' }
            }
          }
        }
      },
      '401': { description: 'Unauthorized' },
      '500': { description: 'Internal Server Error' }
    }
  })
  async getTopicsByCourse(@Param('courseId') courseId: number): Promise<TopicResponseDto[]> {
    const topics = await this.topicService.getTopicsByCourseId(courseId);
    return topics.map(topic => new TopicResponseDto(topic));
  }

  @Get('/course/:courseId/owner')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Get topics by course ID (only if user is owner)',
    description: 'Returns all topics for a given course only if the logged-in user is the owner.',
    responses: {
      '200': {
        description: 'List of topics',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/TopicResponseDto' }
            }
          }
        }
      },
      '401': { description: 'Unauthorized' },
      '403': { description: 'Forbidden - User is not the course owner' },
      '500': { description: 'Internal Server Error' }
    }
  })
  async getTopicsByCourseIfOwner(@Param('courseId') courseId: number, @Req() req: any): Promise<TopicResponseDto[]> {
    const topics = await this.topicService.getTopicsForCourseIfOwner(courseId, req.user);
    return topics.map(topic => new TopicResponseDto(topic));
  }
}
