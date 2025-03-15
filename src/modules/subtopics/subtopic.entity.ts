import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Topic } from "../topic/topic.entity";

@Entity("subtopics")
export class Subtopic {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @Column("text")
    text: string;

    @Column({ type: "text", nullable: true })
    embedding?: string;

    @ManyToOne(() => Topic)
    topic: Topic;

    constructor(name: string, text: string, topic: Topic, embedding?: number[]) {
        this.name = name;
        this.text = text;
        this.topic = topic;
        this.embedding = embedding ? JSON.stringify(embedding) : undefined;
    }

    getVector(): number[] | null {
        return this.embedding ? JSON.parse(this.embedding) : null;
    }
}
