import { Expose } from "class-transformer";

export class SubjectResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromEntities(subjects: { id: number; name: string }[]): SubjectResponseDto[] {
    return subjects.map(subject => new SubjectResponseDto(subject.id, subject.name));
  }
}
