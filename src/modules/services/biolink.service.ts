import axios from "axios";

class BiolinksService {
  private static instance: BiolinksService;
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = "https://agent.exodiafmi.com";
  }

  static getInstance(): BiolinksService {
    if (!BiolinksService.instance) {
      BiolinksService.instance = new BiolinksService();
    }
    return BiolinksService.instance;
  }

  async searchBiolinks(queryText: string, topN: number = 3): Promise<{ results: any[] }> {
    try {
      const response = await axios.post(`${this.baseUrl}/biolinks/search`, {
        query_text: queryText,
        top_n: topN,
      });
      return response.data;
    } catch (error) {
      console.error("Error searching biolinks:", error);
      throw new Error("Failed to search biolinks");
    }
  }
}

export default BiolinksService.getInstance();
