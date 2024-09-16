import { RepositoryService } from '../../domain/services/RepositoryService';
import { Repository } from '../../domain/models/Repository';

export class ListAzureRepositoriesUseCase {
  constructor(private readonly repositoryService: RepositoryService) {}

  async execute(): Promise<Repository[]> {
    return this.repositoryService.listRepositories();
  }
}
