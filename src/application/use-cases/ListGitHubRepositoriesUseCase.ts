import { RepositoryService } from '../../domain/services/RepositoryService';
import { Repository } from '../../domain/models/Repository';

export class ListGitHubRepositoriesUseCase {
  constructor(private readonly repositoryService: RepositoryService) {}

  async execute(): Promise<Repository[]> {
    return this.repositoryService.listRepositories();
  }
}
