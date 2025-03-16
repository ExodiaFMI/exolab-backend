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
              message: { type: "string" },
              subtopic_id: { type: "string" } // Ново поле
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
                reply: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    sources: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          link: { type: "string" },
                          id: { type: "string" }
                        }
                      }
                    }
                  }
                },
                history: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    }
  })
  async startChat(@Body() body: { message: string; subtopic_id?: string }) {
    return this.agentService.startChat(body.message, body.subtopic_id);
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
              message: { type: "string" },
              subtopic_id: { type: "string" } // Ново поле
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
                reply: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    sources: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          link: { type: "string" },
                          id: { type: "string" }
                        }
                      }
                    }
                  }
                },
                history: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    }
  })
  async sendMessage(@Body() body: { session_id: string; message: string; subtopic_id?: string }) {
    return this.agentService.sendMessage(body.session_id, body.message, body.subtopic_id);
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
                },
                reply: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    sources: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          link: { type: "string" },
                          id: { type: "string" }
                        }
                      }
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
              prompt: { type: "string" },
              subtopicId: { type: "number" }
            },
            required: ["prompt", "subtopicId"]
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
  async generateImage(@Body() body: { prompt: string; subtopicId: number }) {
    return this.agentService.generateImage(body.prompt, body.subtopicId);
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

  @Post("/video/generate")
  @OpenAPI({
    summary: "Generate a video",
    description: "Generates a video based on the given prompt.",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              prompt: { type: "string" },
              subtopicId: { type: "number" },
              model: { type: "string", default: "ray-2" },
              resolution: { type: "string", default: "720p" },
              duration: { type: "string", default: "5s" },
              loop: { type: "boolean", default: false }
            },
            required: ["prompt", "subtopicId"]
          }
        }
      }
    },
    responses: {
      "200": {
        description: "Generated video",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                video_url: { type: "string" }
              }
            }
          }
        }
      }
    }
  })
  async generateVideo(
    @Body() body: { prompt: string; subtopicId: number; model?: string; resolution?: string; duration?: string; loop?: boolean }
  ) {
    return this.agentService.generateVideo(body.prompt, body.subtopicId, body.model, body.resolution, body.duration, body.loop);
  }
}
