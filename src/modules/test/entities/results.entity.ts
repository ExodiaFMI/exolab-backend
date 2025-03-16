import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Test } from "./test.entity";
import { User } from "../../user/user.entity";

@Entity("user_test_results")
export class UserTestResult {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Test)
    test: Test;

    @Column({ type: "integer" })
    score: number;

    @Column({ type: "integer" })
    totalQuestions: number;

    constructor(user: User, test: Test, score: number, totalQuestions: number) {
        this.user = user;
        this.test = test;
        this.score = score;
        this.totalQuestions = totalQuestions;
    }
}
