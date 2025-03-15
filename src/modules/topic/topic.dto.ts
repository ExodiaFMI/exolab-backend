import { Expose } from 'class-transformer';
import { Topic } from './topic.entity';

export class TopicResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  constructor(topic: Topic) {
    this.id = topic.id;
    this.name = topic.name;
  }
}
