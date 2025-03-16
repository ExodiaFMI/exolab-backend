import { JsonController, Post, Body } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import BiolinksService from "./biolink.service";

@JsonController("/biolinks")
@OpenAPI({ tags: ["Biolinks"] })
export class BiolinksController {
  private biolinksService = BiolinksService;

  @Post("/search")
  @OpenAPI({
    summary: "Search Biolinks",
    description: "Search for similar biolinks using vector similarity.",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              query_text: { type: "string" },
              top_n: { type: "number", default: 3 }
            },
            required: ["query_text"]
          }
        }
      }
    },
    responses: {
      "200": {
        description: "Successful biolinks search",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                results: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      href: { type: "string" },
                      similiarity: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  async searchBiolinks(@Body() body: { query_text: string; top_n?: number }) {
    return this.biolinksService.searchBiolinks(body.query_text, body.top_n);
  }
}
