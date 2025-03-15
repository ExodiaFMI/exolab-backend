import { SubjectRepository } from "./subject.repository";
import { SubjectResponseDto } from "./subject.dto";

export class SubjectService {
  private static instance: SubjectService;
  private subjectRepo: SubjectRepository;

  private constructor(subjectRepo: SubjectRepository) {
    this.subjectRepo = subjectRepo;
  }

  static getInstance(): SubjectService {
    if (!SubjectService.instance) {
      SubjectService.instance = new SubjectService(SubjectRepository.getInstance());
    }
    return SubjectService.instance;
  }

  async getAllSubjects(): Promise<SubjectResponseDto[]> {
    const subjects = await this.subjectRepo.findAll();
    return SubjectResponseDto.fromEntities(subjects);
  }
}
