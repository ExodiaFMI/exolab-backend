import axios from "axios";
import { ResourceService } from "../resource/resource.service";
import { ResourceType } from "../../enums/resource.enum";

class AgentService {
  private static instance: AgentService;
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = "https://agent.exodiafmi.com";
  }

  static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  async startChat(message: string, subtopic_id?: string): Promise<{ session_id: string; reply: string; history: string[]; source: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/chat/create`, { message, subtopic_id });
      return response.data;
    } catch (error) {
      console.error("Error starting chat:", error);
      throw new Error("Failed to start chat");
    }
  }

  async sendMessage(sessionId: string, message: string, subtopic_id?: string): Promise<{ session_id: string; reply: string; history: string[]; source: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/chat/message`, { session_id: sessionId, message, subtopic_id });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message");
    }
  }


  async getChatHistory(sessionId: string): Promise<{ session_id: string; history: { role: string; content: string }[]; source: string }> {
    try {
      const response = await axios.get(`${this.baseUrl}/chat/messages`, { params: { session_id: sessionId } });
      return response.data;
    } catch (error) {
      console.error("Error retrieving chat history:", error);
      throw new Error("Failed to retrieve chat history");
    }
  }

  async generateImage(prompt: string, subtopicId: number): Promise<{ image_url: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/images/generate`, { prompt });
      const imageUrl = response.data.image_url;

      // Запазваме ресурса в базата
      await ResourceService.getInstance().createResource({
        source_url: imageUrl,
        type: ResourceType.IMAGE,
        subtopic: { id: subtopicId } as any,
      });

      return response.data;
    } catch (error) {
      console.error("Error generating image:", error);
      throw new Error("Failed to generate image");
    }
  }

  async searchImage(prompt: string): Promise<{ image_url: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/images/search`, { prompt });
      return response.data;
    } catch (error) {
      console.error("Error searching image:", error);
      throw new Error("Failed to search image");
    }
  }

  async generateVideo(
    prompt: string,
    subtopicId: number,
    model: string = "ray-2",
    resolution: string = "720p",
    duration: string = "5s",
    loop: boolean = false
  ): Promise<{ video_url: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/videos/generate`, { prompt, model, resolution, duration, loop });
      const videoUrl = response.data.video_url;

      // Запазваме ресурса в базата
      await ResourceService.getInstance().createResource({
        source_url: videoUrl,
        type: ResourceType.VIDEO,
        subtopic: { id: subtopicId } as any,
      });

      return response.data;
    } catch (error) {
      console.error("Error generating video:", error);
      throw new Error("Failed to generate video");
    }
  }
}

export default AgentService.getInstance();
