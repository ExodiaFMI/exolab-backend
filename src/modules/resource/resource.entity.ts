import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { ResourceType } from "../../enums/resource.enum";
import { Subtopic } from "../subtopic/subtopic.entity";

@Entity("resources")
export class Resource extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true })
  source_url: string;

  @Column({ type: "enum", enum: ResourceType })
  type: ResourceType;

  @ManyToOne(() => Subtopic, { onDelete: "CASCADE" })
  subtopic: Subtopic;

  constructor(source_url: string, type: ResourceType, subtopic: Subtopic) {
    super();
    this.source_url = source_url;
    this.type = type;
    this.subtopic = subtopic;
  }
}