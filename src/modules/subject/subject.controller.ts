import { JsonController, Get } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { SubjectService } from "./subject.service";
import { SubjectResponseDto } from "./subject.dto";

@JsonController("/subjects")
@OpenAPI({ tags: ["Subjects"] })
export class SubjectController {
  private subjectService = SubjectService.getInstance();

  @Get("/")
  @OpenAPI({
    summary: "Get all subjects",
    description: "Returns a list of all subjects in the system.",
    responses: {
      "200": {
        description: "List of subjects",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: { $ref: "#/components/schemas/SubjectResponseDto" }
            }
          }
        }
      }
    }
  })
  async getAllSubjects(): Promise<SubjectResponseDto[]> {
    return this.subjectService.getAllSubjects();
  }
}
