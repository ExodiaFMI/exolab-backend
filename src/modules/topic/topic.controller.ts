import { JsonController, Get, Param, UseBefore, Req } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { TopicService } from './topic.service';
import { authMiddleware } from '../../middlewares/auth';

@JsonController('/topics')
@OpenAPI({ tags: ['Topics'] })
export class TopicController {
  private topicService = TopicService.getInstance();

  @Get('/course/:courseId')
  @OpenAPI({
    summary: 'Get topics by course ID',
    description: 'Returns all topics for a given course.',
    responses: { '200': { description: 'List of topics', type: 'array' } }
  })
  async getTopicsByCourse(@Param('courseId') courseId: number) {
    return this.topicService.getTopicsByCourseId(courseId);
  }

  @Get('/course/:courseId/owner')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Get topics by course ID (only if user is owner)',
    description: 'Returns all topics for a given course only if the logged-in user is the owner.',
    responses: { '200': { description: 'List of topics', type: 'array' } }
  })
  async getTopicsByCourseIfOwner(@Param('courseId') courseId: number, @Req() req: any) {
    return this.topicService.getTopicsForCourseIfOwner(courseId, req.user);
  }
}
