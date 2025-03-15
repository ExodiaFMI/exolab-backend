import { IsString, IsEnum, IsNotEmpty, MinLength, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { Language } from '../../enums/language.enum';
import { Course } from './course.entity';
import { UserResponseDto } from '../user/user.dto';

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  @Expose()
  name!: string;

  @IsString()
  @MinLength(10)
  @Expose()
  description!: string;

  @IsString()
  @MinLength(5)
  @Expose()
  testInfo!: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  subjectId!: number;

  @IsEnum(Language)
  @Expose()
  language!: Language;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  ownerId!: number;

  constructor(name: string, description: string, testInfo: string, subjectId: number, language: Language, ownerId: number) {
    this.name = name;
    this.description = description;
    this.testInfo = testInfo;
    this.subjectId = subjectId;
    this.language = language;
    this.ownerId = ownerId;
  }
}

export class CourseResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  testInfo: string;

  @Expose()
  language: string;

  @Expose()
  subject: { id: number; name: string };

  @Expose()
  owner: UserResponseDto;

  constructor(course: Course) {
    this.id = course.id;
    this.name = course.name;
    this.description = course.description;
    this.testInfo = course.testInfo;
    this.language = course.language;
    this.subject = { id: course.subject.id, name: course.subject.name };
    this.owner = new UserResponseDto(course.owner);
  }
}

