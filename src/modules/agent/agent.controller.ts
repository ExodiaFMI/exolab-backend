import { JsonController, Post, Body } from "routing-controllers";
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
}
