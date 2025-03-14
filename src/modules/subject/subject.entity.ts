import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("subjects")
export class Subject {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}