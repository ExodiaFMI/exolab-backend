import { ResourceRepository } from "./resource.repository";
import { Resource } from "./resource.entity";

export class ResourceService {
  private static instance: ResourceService;
  private resourceRepo: ResourceRepository;

  private constructor(resourceRepo: ResourceRepository) {
    this.resourceRepo = resourceRepo;
  }

  static getInstance(): ResourceService {
    if (!ResourceService.instance) {
      ResourceService.instance = new ResourceService(ResourceRepository.getInstance());
    }
    return ResourceService.instance;
  }

  async getAllResources(): Promise<Resource[]> {
    return this.resourceRepo.findAll();
  }

  async getResourceById(id: number): Promise<Resource | null> {
    return this.resourceRepo.findById(id);
  }

  async getResourcesBySubtopic(subtopicId: number): Promise<Resource[]> {
    return this.resourceRepo.findBySubtopicId(subtopicId);
  }

  async createResource(resourceData: Partial<Resource>): Promise<Resource> {
    return this.resourceRepo.createResource(resourceData);
  }

  async deleteResource(id: number): Promise<void> {
    return this.resourceRepo.deleteResource(id);
  }
}
