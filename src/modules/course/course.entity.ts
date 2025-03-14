import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Subject } from "../subject/subject.entity";

@Entity("courses")
export class Course {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @Column("text")
    description: string;

    @Column("text")
    testInfo: string;

    @ManyToOne(() => Subject)
    subject: Subject;

    constructor(name: string, description: string, testInfo: string, subject: Subject) {
        this.name = name;
        this.description = description;
        this.testInfo = testInfo;
        this.subject = subject;
    }
}
