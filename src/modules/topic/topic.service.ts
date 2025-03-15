import { TopicRepository } from './topic.repository';
import { Topic } from './topic.entity';
import { Course } from '../course/course.entity';
import { CourseService } from '../course/course.service';
import { User } from '../user/user.entity';
import { SubtopicService } from '../subtopic/subtopic.service';
import axios from 'axios';

export class TopicService {
  private static instance: TopicService;
  private topicRepo: TopicRepository;
  private subtopicService?: SubtopicService;
  private courseService?: CourseService;

  private constructor(topicRepo: TopicRepository) {
    this.topicRepo = topicRepo;
  }

  static getInstance(): TopicService {
    if (!TopicService.instance) {
      TopicService.instance = new TopicService(TopicRepository.getInstance());
    }
    return TopicService.instance;
  }

  private getSubtopicService(): SubtopicService {
    if (!this.subtopicService) {
      this.subtopicService = SubtopicService.getInstance();
    }
    return this.subtopicService;
  }

  private getCourseService(): CourseService {
    if (!this.courseService) {
      this.courseService = CourseService.getInstance();
    }
    return this.courseService;
  }

  async generateTopicsForCourse(course: Course): Promise<void> {
    try {
      const response = await axios.post("https://agent.exodiafmi.com/topics/extract", {
        content: course.testInfo
      });

      if (!response.data || !response.data.topics) {
        throw new Error("Invalid response from topic extraction service");
      }

      const topics = response.data.topics.map((topicName: string) => {
        return this.topicRepo.createTopic({ name: topicName, course });
      });

      const savedTopics = await Promise.all(topics);

      await this.getSubtopicService().generateSubtopicsForTopics(savedTopics);
    } catch (error) {
      console.error("Error generating topics:", error);
      throw new Error("Failed to generate topics for course");
    }
  }

  async getTopicsByCourseId(courseId: number): Promise<Topic[]> {
    return this.topicRepo.findByCourseId(courseId);
  }

  async getTopicsForCourseIfOwner(courseId: number, user: User): Promise<Topic[]> {
    const course = await this.getCourseService().getCourseById(courseId);

    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }

    if (course.owner.id !== user.id) {
      throw new Error('You are not the owner of this course');
    }

    return this.topicRepo.findByCourseId(courseId);
  }
}
