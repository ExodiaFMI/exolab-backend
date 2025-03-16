import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Question } from "./question.entity";

@Entity("answers")
export class Answer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    answerText: string;

    @Column({ type: "boolean", default: false })
    isCorrect: boolean;

    @ManyToOne(() => Question)
    question: Question;

    constructor(answerText: string, isCorrect: boolean, question: Question) {
        this.answerText = answerText;
        this.isCorrect = isCorrect;
        this.question = question;
    }
}
