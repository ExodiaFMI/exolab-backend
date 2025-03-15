import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Course } from "../course/course.entity";

@Entity("topics")
export class Topic {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @ManyToOne(() => Course)
    course: Course;

    constructor(name: string, course: Course) {
        this.name = name;
        this.course = course;
    }
}
