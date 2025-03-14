import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { SubjectName } from "../../enums/subject.enum";

@Entity("subjects")
export class Subject {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "enum", enum: SubjectName, unique: true })
    name: SubjectName;

    constructor(name: SubjectName) {
        this.name = name;
    }
}
