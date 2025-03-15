import { SubtopicRepository } from "./subtopic.repository";
import { Subtopic } from "./subtopic.entity";
import { Topic } from "../topic/topic.entity";
import axios from "axios";

export class SubtopicService {
  private static instance: SubtopicService;
  private subtopicRepo: SubtopicRepository;

  private constructor(subtopicRepo: SubtopicRepository) {
    this.subtopicRepo = subtopicRepo;
  }

  static getInstance(): SubtopicService {
    if (!SubtopicService.instance) {
      SubtopicService.instance = new SubtopicService(SubtopicRepository.getInstance());
    }
    return SubtopicService.instance;
  }

  async generateSubtopicsForTopics(topics: Topic[]): Promise<void> {
    try {
      const topicNames = topics.map(topic => topic.name);

      const response = await axios.post("https://agent.exodiafmi.com/subtopics/extract", {
        topics: topicNames
      });

      if (!response.data || !response.data.data) {
        throw new Error("Invalid response from subtopic extraction service");
      }

      const subtopicsToSave: Subtopic[] = [];
      response.data.data.forEach((topicData: any) => {
        const matchingTopic = topics.find(t => t.name === topicData.topic);
        if (!matchingTopic) return;

        topicData.subtopics.forEach((subtopicName: string) => {
          subtopicsToSave.push(new Subtopic(subtopicName, "", matchingTopic));
        });
      });

      await Promise.all(subtopicsToSave.map(subtopic => this.subtopicRepo.createSubtopic(subtopic)));
    } catch (error) {
      console.error("Error generating subtopics:", error);
      throw new Error("Failed to generate subtopics for topics");
    }
  }
}
