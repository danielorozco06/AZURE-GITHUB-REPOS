import { Repository } from '../../domain/models/Repository';
import { GitRepository } from 'azure-devops-node-api/interfaces/GitInterfaces';

/**
 * Mapper class for converting Azure DevOps repository data to the application's Repository model.
 */
export class AzureRepositoryMapper {
  /**
   * Converts an Azure DevOps GitRepository object to the application's Repository model.
   *
   * @param {GitRepository} repo - The Azure DevOps repository object to convert.
   * @returns {Repository} The converted Repository object.
   */
  public static toRepository(repo: GitRepository): Repository {
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
