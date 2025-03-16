import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Course } from "../course/course.entity";

@Entity("topics")
export class Topic {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column("text", { array: true, nullable: true })
    resources?: string[];

    @ManyToOne(() => Course)
    course: Course;

    constructor(name: string, course: Course, description?: string, resources?: string[]) {
        this.name = name;
        this.course = course;
        this.description = description;
        this.resources = resources;
    }
}
