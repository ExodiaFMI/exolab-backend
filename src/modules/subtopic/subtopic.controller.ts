import { JsonController, Get, Param, UseBefore, Req } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { SubtopicService } from "./subtopic.service";
import { authMiddleware } from "../../middlewares/auth";
import { SubtopicResponseDto } from "./subtopic.dto";

@JsonController("/subtopics")
@OpenAPI({ tags: ["Subtopics"] })
export class SubtopicController {
  private subtopicService = SubtopicService.getInstance();

  @Get("/course/:courseId/topic/:topicId")
  @OpenAPI({
    summary: "Get subtopics by topic and course ID",
    description: "Returns all subtopics for a given topic in a specific course.",
    responses: {
      "200": {
        description: "List of subtopics",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: { $ref: "#/components/schemas/SubtopicResponseDto" }
            }
          }
        }
      },
      "401": { description: "Unauthorized" },
      "500": { description: "Internal Server Error" }
    }
  })
  async getSubtopicsByTopicAndCourse(
    @Param("topicId") topicId: number,
    @Param("courseId") courseId: number
  ): Promise<SubtopicResponseDto[]> {
    const subtopics = await this.subtopicService.getSubtopicsByTopicAndCourse(topicId, courseId);
    return subtopics.map(subtopic => new SubtopicResponseDto(subtopic)); // ✅ Връщаме DTO-та
  }

  @Get("/course/:courseId/topic/:topicId/owner")
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: "Get subtopics by topic and course ID (only if user is owner)",
    description: "Returns all subtopics for a given topic in a specific course only if the logged-in user is the owner.",
    responses: {
      "200": {
        description: "List of subtopics",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: { $ref: "#/components/schemas/SubtopicResponseDto" }
            }
          }
        }
      },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden - User is not the course owner" },
      "500": { description: "Internal Server Error" }
    }
  })
  async getSubtopicsByTopicAndCourseIfOwner(
    @Param("topicId") topicId: number,
    @Param("courseId") courseId: number,
    @Req() req: any
  ): Promise<SubtopicResponseDto[]> {
    const subtopics = await this.subtopicService.getSubtopicsByTopicAndCourseIfOwner(topicId, courseId, req.user);
    return subtopics.map(subtopic => new SubtopicResponseDto(subtopic)); // ✅ DTO в респонса
  }
}
