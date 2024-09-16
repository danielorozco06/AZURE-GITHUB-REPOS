import { Repository } from '../../domain/models/Repository';
import { RepositoryService } from '../../domain/services/RepositoryService';
import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api';
import { GitRepository } from 'azure-devops-node-api/interfaces/GitInterfaces';

/**
 * AzureRepository class implements the RepositoryService interface for Azure DevOps.
 * It provides methods to interact with Azure DevOps repositories.
 */
export class AzureRepository implements RepositoryService {
  private readonly connection: WebApi;

  /**
   * Creates an instance of AzureRepository.
   * @param {string} orgUrl - The URL of the Azure DevOps organization.
   * @param {string} token - The personal access token for authentication.
   */
  constructor(private readonly orgUrl: string, private readonly token: string) {
    const authHandler = getPersonalAccessTokenHandler(this.token);
    this.connection = new WebApi(this.orgUrl, authHandler);
  }

  /**
   * Retrieves a list of all repositories in the Azure DevOps organization.
   * @returns {Promise<Repository[]>} A promise that resolves to an array of Repository objects.
   */
  async listRepositories(): Promise<Repository[]> {
    const gitApi = await this.connection.getGitApi();
    const repositories: GitRepository[] = await gitApi.getRepositories();
    return repositories.map(repo => ({
      id: repo.id ?? '',
      name: repo.name ?? '',
      url: repo.url ?? '',
      provider: 'Azure',
      project: repo.project?.name ?? '',
      defaultBranch: repo.defaultBranch ?? '',
      size: repo.size ?? 0
    }));
  }

  /**
   * Retrieves details of a specific repository.
   * @param {string} repositoryId - The ID of the repository to fetch details for.
   * @returns {Promise<Repository>} A promise that resolves to a Repository object.
   */
  async getRepositoryDetails(repositoryId: string): Promise<Repository> {
    const gitApi = await this.connection.getGitApi();
    const repo = await gitApi.getRepository(repositoryId);
    return {
      id: repo.id ?? '',
      name: repo.name ?? '',
      url: repo.url ?? '',
      provider: 'Azure',
      project: repo.project?.name ?? '',
      defaultBranch: repo.defaultBranch ?? '',
      size: repo.size ?? 0
    };
  }
}
