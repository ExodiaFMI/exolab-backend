import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Test } from "./test.entity";
import { Answer } from "./answer.entity";
import { Subtopic } from "../../subtopic/subtopic.entity";

@Entity("questions")
export class Question {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    questionText: string;

    @Column({ type: "enum", enum: ["Multiple Choice", "Open Answer"] })
    questionType: string;

    @Column("text", { nullable: true })
    correctAnswer: string;

    @Column({ type: "enum", enum: ["Easy", "Medium", "Hard"] })
    difficulty: string;

    @Column("text", { nullable: true })
    explanation: string;

    @ManyToOne(() => Test)
    test: Test;

    @ManyToOne(() => Subtopic)
    subtopic: Subtopic;

    @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
    answers!: Answer[];

    constructor(questionText: string, questionType: string, correctAnswer: string, difficulty: string, explanation: string, test: Test, subtopic: Subtopic) {
        this.questionText = questionText;
        this.questionType = questionType;
        this.correctAnswer = correctAnswer;
        this.difficulty = difficulty;
        this.explanation = explanation;
        this.test = test;
        this.subtopic = subtopic;
    }
}
