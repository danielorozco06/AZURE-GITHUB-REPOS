import { RepositoryService } from '../../domain/services/RepositoryService';
import { AzureRepository } from '../repositories/AzureRepository';
import { GitHubRepository } from '../repositories/GitHubRepository';

/**
 * Factory class for creating RepositoryService instances.
 */
export class RepositoryServiceFactory {
  /**
   * Creates a RepositoryService instance based on the provided repository provider.
   * @param {string} repoProvider - The repository provider ('azure' or 'github').
   * @param {string} org - The organization URL (for Azure) or name (for GitHub).
   * @param {string} token - The access token for the selected provider.
   * @returns {RepositoryService} An instance of the appropriate RepositoryService.
   * @throws {Error} If an unsupported repository provider is specified.
   */
  static create(repoProvider: string, org: string, token: string): RepositoryService {
    switch (repoProvider.toLowerCase()) {
      case 'azure':
        return new AzureRepository(org, token);
      case 'github':
        return new GitHubRepository(org, token);
      default:
        throw new Error(`Unsupported repository provider: ${repoProvider}`);
    }
  }
}
