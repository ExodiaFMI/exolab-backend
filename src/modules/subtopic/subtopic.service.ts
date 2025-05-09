import { SubtopicRepository } from "./subtopic.repository";
import { Subtopic } from "./subtopic.entity";
import { TopicService } from "../topic/topic.service";
import { CourseService } from "../course/course.service";
import { User } from "../user/user.entity";
import { Topic } from "../topic/topic.entity";
import axios from "axios";

export class SubtopicService {
  private static instance: SubtopicService;
  private subtopicRepo: SubtopicRepository;
  private topicService?: TopicService;
  private courseService?: CourseService;

  private constructor(subtopicRepo: SubtopicRepository) {
    this.subtopicRepo = subtopicRepo;
  }

  static getInstance(): SubtopicService {
    if (!SubtopicService.instance) {
      SubtopicService.instance = new SubtopicService(SubtopicRepository.getInstance());
    }
    return SubtopicService.instance;
  }

  private getCourseService(): CourseService {
    if (!this.courseService) {
      this.courseService = CourseService.getInstance();
    }
    return this.courseService;
  }

  async generateSubtopicsForTopics(topics: Topic[]): Promise<void> {
    try {
      const topicNames = topics.map(topic => topic.name);
      const topicResources = topics.map(topic => topic.resources || []).flat();
      const subtopicRes = await axios.post("https://agent.exodiafmi.com/subtopics/extract", {
        topics: topicNames,
        resources: topicResources,
      });
  
      if (!subtopicRes.data || !subtopicRes.data.data) {
        throw new Error("Invalid response from subtopic extraction service");
      }
  
      const subtopicsInMemory: Subtopic[] = [];
      subtopicRes.data.data.forEach((topicData: any) => {
        const matchingTopic = topics.find(t => t.name === topicData.topic);
        if (!matchingTopic) return;
  
        topicData.subtopics.forEach((subtopicName: string) => {
          const tempSubtopic = new Subtopic(subtopicName, "", matchingTopic);
          subtopicsInMemory.push(tempSubtopic);
        });
      });
  
      if (!subtopicsInMemory.length) return;
  
      const dataToExplain: { topic: string; subtopics: string[] }[] = [];
      topics.forEach(t => {
        const subNames = subtopicsInMemory
          .filter(st => st.topic === t)
          .map(st => st.name);
  
        if (subNames.length > 0) {
          dataToExplain.push({ topic: t.name, subtopics: subNames });
        }
      });
  
      const batchSize = 5;
      const batches: { topic: string; subtopics: string[] }[][] = [];
      for (let i = 0; i < dataToExplain.length; i += batchSize) {
        batches.push(dataToExplain.slice(i, i + batchSize));
      }

      console.log(`Processing ${batches.length} batches of subtopics`);

      const explanationPromises = batches.map((batch, index) => {
        console.log(`Processing batch ${index + 1}/${batches.length}`);
        return axios.post("https://agent.exodiafmi.com/explanations/generate", {
          data: batch,
          resources: topicResources,
        })
          .then(explResponse => {
            if (!explResponse.data || !explResponse.data.explanations) {
              throw new Error("Invalid response from explanations service");
            }
  
            // Ъпдейтваме субтопиците в паметта с получените обяснения
            explResponse.data.explanations.forEach((item: any) => {
              const subtopic = subtopicsInMemory.find(st =>
                st.topic.name === item.topic && st.name === item.subtopic
              );
              if (subtopic) {
                subtopic.text = item.explanation.replace(/\x00/g, "");
              }
            });
          })
          .catch(error => {
            console.error("Error in batch processing:", error);
          });
      });
  
      await Promise.all(explanationPromises);
  
      const vectorizePayload = subtopicsInMemory.map((st, index) => ({
        id: index.toString(),
        text: st.text || "",
      }));
  
      try {
        const vectResponse = await axios.post("https://agent.exodiafmi.com/vectorize/array", vectorizePayload);
  
        if (!vectResponse.data || !vectResponse.data.results) {
          throw new Error("Invalid response from vectorize service");
        }
  
        const embeddingsByIndex: Record<string, number[]> = {};
        vectResponse.data.results.forEach((res: any) => {
          embeddingsByIndex[res.id] = res.embedding;
        });
  
        subtopicsInMemory.forEach((st, index) => {
          const embedding = embeddingsByIndex[index.toString()];
          if (embedding) {
            st.embedding = JSON.stringify(embedding);
          }
        });
      } catch (error) {
        console.error("Error in embedding generation:", error);
      }
  
      const saveBatchSize = 5;
      const saveBatches: Subtopic[][] = [];
      for (let i = 0; i < subtopicsInMemory.length; i += saveBatchSize) {
        saveBatches.push(subtopicsInMemory.slice(i, i + saveBatchSize));
      }
  
      const savePromises = saveBatches.map(batch => this.subtopicRepo.createSubtopics(batch));
      await Promise.all(savePromises);
  
      console.log("✅ Successfully processed all subtopics!");
    } catch (error) {
      console.error("Error generating subtopics with text and embedding:", error);
      throw new Error("Failed to generate subtopics with text and embedding");
    }
  }
  

  async getSubtopicsByTopicAndCourse(topicId: number, courseId: number) {
    return this.subtopicRepo.findByTopicAndCourse(topicId, courseId);
  }

  async getSubtopicsByTopicAndCourseIfOwner(topicId: number, courseId: number, user: User) {
    const course = await this.getCourseService().getCourseById(courseId);

    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }

    if (course.owner.id !== user.id) {
      throw new Error("You are not the owner of this course");
    }

    return this.subtopicRepo.findByTopicAndCourse(topicId, courseId);
  }

  async getSubtopicById(subtopicId: number): Promise<Subtopic | null> {
    return this.subtopicRepo.findById(subtopicId);
  }
}
