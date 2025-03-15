import axios from "axios";

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

  async startChat(message: string): Promise<{ session_id: string; reply: string; history: string[] }> {
    try {
      const response = await axios.post(`${this.baseUrl}/chat/create`, { message });
      return response.data;
    } catch (error) {
      console.error("Error starting chat:", error);
      throw new Error("Failed to start chat");
    }
  }

  async sendMessage(sessionId: string, message: string): Promise<{ session_id: string; reply: string; history: string[] }> {
    try {
      const response = await axios.post(`${this.baseUrl}/chat/message`, { session_id: sessionId, message });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message");
    }
  }

  async getChatHistory(sessionId: string): Promise<{ session_id: string; history: { role: string; content: string }[] }> {
    try {
      const response = await axios.get(`${this.baseUrl}/chat/messages`, { params: { session_id: sessionId } });
      return response.data;
    } catch (error) {
      console.error("Error retrieving chat history:", error);
      throw new Error("Failed to retrieve chat history");
    }
  }

  async generateImage(prompt: string): Promise<{ image_url: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/images/generate`, { prompt });
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
    model: string = "ray-2",
    resolution: string = "720p",
    duration: string = "5s",
    loop: boolean = false
  ): Promise<{ video_url: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/videos/generate`, { prompt, model, resolution, duration, loop });
      return response.data;
    } catch (error) {
      console.error("Error generating video:", error);
      throw new Error("Failed to generate video");
    }
  }
}

export default AgentService.getInstance();
