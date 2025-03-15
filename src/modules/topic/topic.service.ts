import { TopicRepository } from './topic.repository';
import { Topic } from './topic.entity';
import { Course } from '../course/course.entity';
import axios from 'axios';

export class TopicService {
  private static instance: TopicService;
  private topicRepo: TopicRepository;

  private constructor(topicRepo: TopicRepository) {
    this.topicRepo = topicRepo;
  }

  static getInstance(): TopicService {
    if (!TopicService.instance) {
      TopicService.instance = new TopicService(TopicRepository.getInstance());
    }
    return TopicService.instance;
  }

  async generateTopicsForCourse(course: Course): Promise<Topic[]> {
    try {
      const response = await axios.post('https://agent.exodiafmi.com/topics/extract', {
        content: course.testInfo
      });

      if (!response.data || !response.data.topics) {
        throw new Error('Invalid response from topic extraction service');
      }

      const topics = response.data.topics.map((topicName: string) => {
        return this.topicRepo.createTopic({ name: topicName, course });
      });

      return Promise.all(topics);
    } catch (error) {
      console.error('Error generating topics:', error);
      throw new Error('Failed to generate topics for course');
    }
  }
}
