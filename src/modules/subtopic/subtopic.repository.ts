import { Repository } from "typeorm";
import { Subtopic } from "./subtopic.entity";
import AppDataSource from "../../config/database";

export class SubtopicRepository {
  private static instance: SubtopicRepository;
  private repo: Repository<Subtopic>;

  private constructor(repo: Repository<Subtopic>) {
    this.repo = repo;
  }

  static getInstance(): SubtopicRepository {
    if (!SubtopicRepository.instance) {
      SubtopicRepository.instance = new SubtopicRepository(AppDataSource.getRepository(Subtopic));
    }
    return SubtopicRepository.instance;
  }

  async findAll(): Promise<Subtopic[]> {
    return this.repo.find({ relations: ["topic"] });
  }

  async findById(id: number): Promise<Subtopic | null> {
    return this.repo.findOne({ where: { id }, relations: ["topic"] });
  }

  async findByTopicId(topicId: number): Promise<Subtopic[]> {
    return this.repo.find({
      where: { topic: { id: topicId } },
      relations: ["topic"]
    });
  }

  async findByTopicAndCourse(topicId: number, courseId: number): Promise<Subtopic[]> {
    return this.repo.createQueryBuilder("subtopic")
      .leftJoinAndSelect("subtopic.topic", "topic")
      .leftJoinAndSelect("topic.course", "course")
      .where("topic.id = :topicId", { topicId })
      .andWhere("course.id = :courseId", { courseId })
      .getMany();
  }

  async createSubtopic(subtopicData: Partial<Subtopic>): Promise<Subtopic> {
    const subtopic = this.repo.create(subtopicData);
    return this.repo.save(subtopic);
  }

  async createSubtopics(subtopics: Subtopic[]): Promise<void> {
    console.log("Subtopics to save:", subtopics.length);
    if (!subtopics.length) return;

    const queryRunner = this.repo.manager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager.createQueryBuilder()
        .insert()
        .into(Subtopic)
        .values(subtopics)
        .execute();
      await queryRunner.commitTransaction();
    } catch (error) {
      console.error("Error in bulk insert for subtopics:", error);
      await queryRunner.rollbackTransaction();
      throw new Error("Failed to save subtopics in bulk");
    } finally {
      await queryRunner.release();
    }
  }

  async deleteSubtopic(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
