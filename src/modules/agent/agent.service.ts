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

  async getChatHistory(sessionId: string): Promise<{ session_id: string; history: { role: string; content: string }[] }> {
    try {
      const response = await axios.get(`${this.baseUrl}/messages`, { params: { session_id: sessionId } });
      return response.data;
    } catch (error) {
      console.error("Error retrieving chat history:", error);
      throw new Error("Failed to retrieve chat history");
    }
  }
}

export default AgentService.getInstance();
