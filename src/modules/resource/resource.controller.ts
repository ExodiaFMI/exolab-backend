import { JsonController, Get, Delete, Param } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { ResourceService } from "./resource.service";
import { Resource } from "./resource.entity";

@JsonController("/resources")
@OpenAPI({ tags: ["Resources"] })
export class ResourceController {
  private resourceService = ResourceService.getInstance();

  @Get("/:id")
  @OpenAPI({
    summary: "Get a resource by ID",
    description: "Returns a resource by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "number" }
      }
    ],
    responses: {
      "200": {
        description: "Resource found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Resource" }
          }
        }
      },
      "404": { description: "Resource not found" }
    }
  })
  async getResourceById(@Param("id") id: number): Promise<Resource | null> {
    return this.resourceService.getResourceById(id);
  }

  @Delete("/:id")
  @OpenAPI({
    summary: "Delete a resource",
    description: "Deletes a resource by its ID.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "number" }
      }
    ],
    responses: {
      "200": { description: "Resource deleted" },
      "404": { description: "Resource not found" }
    }
  })
  async deleteResource(@Param("id") id: number): Promise<void> {
    return this.resourceService.deleteResource(id);
  }
}
