import { JsonController, Post, Body, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { TestManagerService } from "./testManager.service";
import { GenerateTestDto, TestResponseDto } from "./entities/test.dto";
import { authMiddleware } from "../../middlewares/auth";

@JsonController("/tests")
@OpenAPI({ tags: ["Tests"] })
export class TestManagerController {
  private testManagerService = TestManagerService.getInstance();

  @Post("/generate")
  //@UseBefore(authMiddleware)
  @OpenAPI({
    summary: "Generate a test based on a subtopic",
    description: "Creates a test including questions and answers based on the specified subtopic ID.",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/GenerateTestDto" },
        },
      },
    },
    responses: {
      "201": {
        description: "Test generated successfully",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/TestResponseDto" },
          },
        },
      },
      "400": { description: "Bad request - Invalid input" },
      "500": { description: "Internal server error" },
    },
  })
  async generateTest(@Body() data: GenerateTestDto): Promise<TestResponseDto> {
    const test = await this.testManagerService.generateTestFromSubtopic(
      data.subtopicId
    );
    return new TestResponseDto(test);
  }
}
