import { Expose, Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { Test } from "../entities/test.entity";
import { Question } from "../entities/question.entity";
import { Answer } from "../entities/answer.entity";
import { Subtopic } from "../../subtopic/subtopic.entity";


export class GenerateTestDto {
  @IsNumber()
  subtopicId!: number;
}

export class AnswerResponseDto {
  @Expose()
  id: number;

  @Expose()
  answerText: string;

  @Expose()
  isCorrect: boolean;

  constructor(answer: Answer) {
    this.id = answer.id;
    this.answerText = answer.answerText;
    this.isCorrect = answer.isCorrect;
  }
}

export class QuestionResponseDto {
  @Expose()
  id: number;

  @Expose()
  questionText: string;

  @Expose()
  questionType: string;

  @Expose()
  correctAnswer: string;

  @Expose()
  @Type(() => AnswerResponseDto)
  answers: AnswerResponseDto[];

  constructor(question: Question) {
    this.id = question.id;
    this.questionText = question.questionText;
    this.questionType = question.questionType;
    this.correctAnswer = question.correctAnswer;

    // 🔹 Проверяваме дали въпросът има отговори, преди да извикаме .map()
    this.answers = question.answers ? question.answers.map((answer) => new AnswerResponseDto(answer)) : [];
  }
}

export class SubtopicResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  text: string;

  constructor(subtopic: Subtopic) {
    this.id = subtopic.id;
    this.name = subtopic.name;
    this.text = subtopic.text;
  }
}

export class TestResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => QuestionResponseDto)
  questions: QuestionResponseDto[];

  @Expose()
  @Type(() => SubtopicResponseDto)
  subtopic: SubtopicResponseDto | null;

  constructor(test: Test) {
    this.id = test.id;
    this.title = test.title;
    this.description = test.description;

    this.questions = test.questions ? test.questions.map((question) => new QuestionResponseDto(question)) : [];

    this.subtopic = test.questions && test.questions.length > 0 
      ? new SubtopicResponseDto(test.questions[0].subtopic) 
      : null;
  }
}
