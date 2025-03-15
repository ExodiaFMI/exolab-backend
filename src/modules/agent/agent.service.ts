import axios from "axios";

class AgentService {
  private static instance: AgentService;
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = "https://agent.exodiafmi.com/chat";
  }

  static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  async startChat(message: string): Promise<{ session_id: string; reply: string; history: string[] }> {
    try {
      const response = await axios.post(`${this.baseUrl}/create`, { message });
      return response.data;
    } catch (error) {
      console.error("Error starting chat:", error);
      throw new Error("Failed to start chat");
    }
  }

  async sendMessage(sessionId: string, message: string): Promise<{ session_id: string; reply: string; history: string[] }> {
    try {
      const response = await axios.post(`${this.baseUrl}/message`, { session_id: sessionId, message });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message");
    }
  }
}

export default AgentService.getInstance();
