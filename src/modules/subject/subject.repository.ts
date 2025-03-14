import AppDataSource from '../../config/database';
import { Subject } from "./subject.entity";

export const SubjectRepository = AppDataSource.getRepository(Subject);