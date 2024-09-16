import { RepositoryService } from '../../domain/services/RepositoryService';
import { Repository } from '../../domain/models/Repository';

/**
 * Use case for listing repositories.
 */
export class ListRepositoriesUseCase {
  /**
   * Creates an instance of ListRepositoriesUseCase.
   * @param {RepositoryService} repositoryService - The repository service to use for listing repositories.
   */
  constructor(private readonly repositoryService: RepositoryService) {}

  /**
   * Executes the use case to list repositories.
   * @returns {Promise<Repository[]>} A promise that resolves to an array of Repository objects.
   */
  async execute(): Promise<Repository[]> {
    return this.repositoryService.listRepositories();
  }
}
