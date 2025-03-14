import { AppDataSource } from "../../config/database";
import { Course } from "./course.entity";

export const CourseRepository = AppDataSource.getRepository(Course);