import { Expose } from 'class-transformer';
import { Subtopic } from './subtopic.entity';


export class SubtopicResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  text: string;

  @Expose()
  topic: { id: number; name: string };

  constructor(subtopic: Subtopic) {
    this.id = subtopic.id;
    this.name = subtopic.name;
    this.text = subtopic.text;
    this.topic = { id: subtopic.topic.id, name: subtopic.topic.name };
  }
}
