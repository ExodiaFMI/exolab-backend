import { Repository } from "typeorm";
import { Resource } from "./resource.entity";
import AppDataSource from "../../config/database";

export class ResourceRepository {
  private static instance: ResourceRepository;
  private repo: Repository<Resource>;

  private constructor(repo: Repository<Resource>) {
    this.repo = repo;
  }

  static getInstance(): ResourceRepository {
    if (!ResourceRepository.instance) {
      ResourceRepository.instance = new ResourceRepository(AppDataSource.getRepository(Resource));
    }
    return ResourceRepository.instance;
  }

  async findAll(): Promise<Resource[]> {
    return this.repo.find({ relations: ["subtopic"] });
  }

  async findById(id: number): Promise<Resource | null> {
    return this.repo.findOne({ where: { id }, relations: ["subtopic"] });
  }

  async findBySubtopicId(subtopicId: number): Promise<Resource[]> {
    return this.repo.find({ where: { subtopic: { id: subtopicId } }, relations: ["subtopic"] });
  }

  async createResource(resourceData: Partial<Resource>): Promise<Resource> {
    const resource = this.repo.create(resourceData);
    return this.repo.save(resource);
  }

  async deleteResource(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
