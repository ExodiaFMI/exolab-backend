import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Subject } from "../subject/subject.entity";
import { Language } from "../../enums/language.enum";
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

    @Column({ type: "enum", enum: Language })
    language: Language;

    constructor(name: string, description: string, testInfo: string, subject: Subject, language: Language) {
        this.name = name;
        this.description = description;
        this.testInfo = testInfo;
        this.subject = subject;
        this.language = language;
    }
}
