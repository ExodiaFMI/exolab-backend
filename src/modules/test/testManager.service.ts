import { TestService } from "./services/test.service";
import { QuestionService } from "./services/question.service";
import { AnswerService } from "./services/answer.service";
import { SubtopicService } from "../subtopic/subtopic.service";
import { TopicService } from "../topic/topic.service";
import { Test } from "./entities/test.entity";
import axios from "axios";

export class TestManagerService {
  private static instance: TestManagerService;
  private testService: TestService;
  private questionService: QuestionService;
  private answerService: AnswerService;
  private subtopicService: SubtopicService;
  private topicService: TopicService;

  private constructor() {
    this.testService = TestService.getInstance();
    this.questionService = QuestionService.getInstance();
    this.answerService = AnswerService.getInstance();
    this.subtopicService = SubtopicService.getInstance();
    this.topicService = TopicService.getInstance();
  }

  static getInstance(): TestManagerService {
    if (!TestManagerService.instance) {
      TestManagerService.instance = new TestManagerService();
    }
    return TestManagerService.instance;
  }

  async generateTestFromSubtopic(subtopicId: number): Promise<Test> {
    try {
      const subtopic = await this.subtopicService.getSubtopicById(subtopicId);
      if (!subtopic) throw new Error(`Subtopic with ID ${subtopicId} not found`);

      const topic = await this.topicService.getTopicById(subtopic.topic.id);
      if (!topic) throw new Error(`Topic not found for Subtopic ID ${subtopicId}`);

      const allSubtopics = await this.subtopicService.getSubtopicsByTopicAndCourse(topic.id, topic.course.id);

      const requestData = {
        data: [
          {
            topic: topic.name,
            subtopics: allSubtopics.map((st) => st.name),
          },
        ],
        explanations: [
          {
            topic: topic.name,
            subtopic: subtopic.name,
            explanation: subtopic.text,
          },
        ],
      };

      const response = await axios.post("https://agent.exodiafmi.com/questions/generate", requestData);
      if (!response.data || !response.data.questions) {
        throw new Error("Invalid response from /questions/generate API");
      }

      const newTest = await this.testService.createTest({
        title: `Test on ${topic.name}`,
        description: `Generated test for topic: ${topic.name}`,
      });

      for (const questionItem of response.data.questions) {
        const newQuestion = await this.questionService.createQuestion({
          questionText: questionItem.question,
          questionType: questionItem.question_type,
          correctAnswer: questionItem.correct_answer,
          difficulty: questionItem.difficulty,
          explanation: questionItem.explanation,
          test: newTest,
          subtopic: subtopic,
        });

        if (questionItem.answers && Array.isArray(questionItem.answers) && questionItem.answers.length > 0) {
          for (const answerText of questionItem.answers) {
            try {
              await this.answerService.createAnswer({
                answerText: answerText,
                isCorrect: answerText === questionItem.correct_answer,
                question: newQuestion,
              });
            } catch (error: any) {
              throw new Error(`Failed to save answer: "${answerText}" for question ID: ${newQuestion.id}`);
            }
          }
        }
      }

      return newTest;
    } catch (error: any) {
      throw new Error(`Test generation failed: ${error.message}`);
    }
  }
}
