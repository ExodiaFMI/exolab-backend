import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Subject } from "../subject/subject.entity";
import { Language } from "../../enums/language.enum";
import { User } from "../user/user.entity";

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

    @ManyToOne(() => Subject, { nullable: false, onDelete: "CASCADE" })
    subject: Subject;

    @Column({ type: "enum", enum: Language })
    language: Language;

    @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
    owner: User;

    constructor(name: string, description: string, testInfo: string, subject: Subject, language: Language, owner: User) {
        this.name = name;
        this.description = description;
        this.testInfo = testInfo;
        this.subject = subject;
        this.language = language;
        this.owner = owner;
    }
}
