import { JsonController, Post, Get, Body, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import AgentService from "./agent.service";

@JsonController("/agent")
@OpenAPI({ tags: ["Agent"] })
export class AgentController {
  private agentService = AgentService;

  @Post("/chat/start")
  @OpenAPI({
    summary: "Start a new chat session",
    description: "Creates a new chat session and returns a session ID.",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string" }
            },
            required: ["message"]
          }
        }
      }
    },
    responses: {
      "200": {
        description: "Chat session created",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                session_id: { type: "string" },
                reply: { type: "string" },
                history: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    }
  })
  async startChat(@Body() body: { message: string }) {
    return this.agentService.startChat(body.message);
  }

  @Post("/chat/message")
  @OpenAPI({
    summary: "Send a message in an existing chat session",
    description: "Sends a message to an ongoing chat session.",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              session_id: { type: "string" },
              message: { type: "string" }
            },
            required: ["session_id", "message"]
          }
        }
      }
    },
    responses: {
      "200": {
        description: "Message sent",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                session_id: { type: "string" },
                reply: { type: "string" },
                history: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    }
  })
  async sendMessage(@Body() body: { session_id: string; message: string }) {
    return this.agentService.sendMessage(body.session_id, body.message);
  }

  @Get("/chat/messages")
  @OpenAPI({
    summary: "Get chat history",
    description: "Retrieves the full history of a chat session.",
    parameters: [
      {
        name: "session_id",
        in: "query",
        required: true,
        schema: { type: "string" }
      }
    ],
    responses: {
      "200": {
        description: "Chat history retrieved",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                session_id: { type: "string" },
                history: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      role: { type: "string" },
                      content: { type: "string" }
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
  async getChatHistory(@QueryParam("session_id") sessionId: string) {
    return this.agentService.getChatHistory(sessionId);
  }

  @Post("/image/generate")
  @OpenAPI({
    summary: "Generate an image",
    description: "Generates an image based on the given prompt.",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              prompt: { type: "string" }
            },
            required: ["prompt"]
          }
        }
      }
    },
    responses: {
      "200": {
        description: "Generated image",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                image_url: { type: "string" }
              }
            }
          }
        }
      }
    }
  })
  async generateImage(@Body() body: { prompt: string }) {
    return this.agentService.generateImage(body.prompt);
  }

  @Post("/image/search")
  @OpenAPI({
    summary: "Search for an image",
    description: "Searches for an image based on the given prompt.",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              prompt: { type: "string" }
            },
            required: ["prompt"]
          }
        }
      }
    },
    responses: {
      "200": {
        description: "Found image",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                image_url: { type: "string" }
              }
            }
          }
        }
      }
    }
  })
  async searchImage(@Body() body: { prompt: string }) {
    return this.agentService.searchImage(body.prompt);
  }
}
