import { Repository } from '../../domain/models/Repository';
import { GitRepository } from 'azure-devops-node-api/interfaces/GitInterfaces';

/**
 * Mapper class for converting GitHub and Azure DevOps repository data to the application's Repository model.
 */
export class RepositoryMapper {
  /**
   * Converts a GitHub repository object to the application's Repository model.
   *
   * @param {any} repo - The GitHub repository object to convert.
   * @returns {Repository} The converted Repository object.
   */
  public static fromGitHub(repo: any): Repository {
    return {
      id: repo.id.toString(),
      name: repo.name,
      url: repo.html_url,
      provider: 'GitHub',
      defaultBranch: repo.default_branch,
      size: repo.size
    };
  }

  /**
   * Converts an Azure DevOps GitRepository object to the application's Repository model.
   *
   * @param {GitRepository} repo - The Azure DevOps repository object to convert.
   * @returns {Repository} The converted Repository object.
   */
  public static fromAzure(repo: GitRepository): Repository {
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
