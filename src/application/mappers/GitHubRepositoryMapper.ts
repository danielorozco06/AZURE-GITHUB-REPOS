import { Repository } from '../../domain/models/Repository';

/**
 * Mapper class for converting GitHub repository data to the application's Repository model.
 */
export class GitHubRepositoryMapper {
  /**
   * Converts a GitHub repository object to the application's Repository model.
   *
   * @param {any} repo - The GitHub repository object to convert.
   * @returns {Repository} The converted Repository object.
   */
  public static toRepository(repo: any): Repository {
    return {
      id: repo.id.toString(),
      name: repo.name,
      url: repo.html_url,
      provider: 'GitHub',
      defaultBranch: repo.default_branch,
      size: repo.size
    };
  }
}
