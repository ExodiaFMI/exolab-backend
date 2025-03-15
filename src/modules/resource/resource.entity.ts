import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ResourceType } from "../../enums/resource.enum";

@Entity("resources")
export class Resource extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, unique: true })
  source_url: string;

  @Column({ type: "enum", enum: ResourceType })
  type: ResourceType;

  constructor(source_url: string, type: ResourceType) {
    super();
    this.source_url = source_url;
    this.type = type;
  }
}
