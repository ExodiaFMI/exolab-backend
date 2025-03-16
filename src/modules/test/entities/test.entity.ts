import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "../../user/user.entity";
import { Question } from "./question.entity";

@Entity("tests")
export class Test {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title: string;

    @Column("text", { nullable: true })
    description: string;

    @ManyToOne(() => User)
    createdBy: User;

    @OneToMany(() => Question, (question) => question.test, { cascade: true })
    questions!: Question[];

    constructor(title: string, description: string, createdBy: User) {
        this.title = title;
        this.description = description;
        this.createdBy = createdBy;
    }
}
