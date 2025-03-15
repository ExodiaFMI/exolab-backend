import { JsonController, Get, Param, UseBefore, Req } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { SubtopicService } from "./subtopic.service";
import { authMiddleware } from "../../middlewares/auth";

@JsonController("/subtopics")
@OpenAPI({ tags: ["Subtopics"] })
export class SubtopicController {
  private subtopicService = SubtopicService.getInstance();

  @Get("/course/:courseId/topic/:topicId")
  @OpenAPI({
    summary: "Get subtopics by topic and course ID",
    description: "Returns all subtopics for a given topic in a specific course.",
    responses: { "200": { description: "List of subtopics", type: "array" } }
  })
  async getSubtopicsByTopicAndCourse(
    @Param("topicId") topicId: number, 
    @Param("courseId") courseId: number
  ) {
    return this.subtopicService.getSubtopicsByTopicAndCourse(topicId, courseId);
  }

  @Get("/course/:courseId/topic/:topicId/owner")
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: "Get subtopics by topic and course ID (only if user is owner)",
    description: "Returns all subtopics for a given topic in a specific course only if the logged-in user is the owner.",
    responses: { "200": { description: "List of subtopics", type: "array" } }
  })
  async getSubtopicsByTopicAndCourseIfOwner(
    @Param("topicId") topicId: number, 
    @Param("courseId") courseId: number, 
    @Req() req: any
  ) {
    return this.subtopicService.getSubtopicsByTopicAndCourseIfOwner(topicId, courseId, req.user);
  }
}
