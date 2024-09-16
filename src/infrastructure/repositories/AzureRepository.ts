import { Repository } from '../../domain/models/Repository';
import { RepositoryService } from '../../domain/services/RepositoryService';
import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api';
import { GitRepository } from 'azure-devops-node-api/interfaces/GitInterfaces';

export class AzureRepository implements RepositoryService {
  private readonly connection: WebApi;

  constructor(private readonly orgUrl: string, private readonly token: string) {
    const authHandler = getPersonalAccessTokenHandler(this.token);
    this.connection = new WebApi(this.orgUrl, authHandler);
  }

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
