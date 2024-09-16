import { Repository } from '../../domain/models/Repository';
import { RepositoryService } from '../../domain/services/RepositoryService';
import { Octokit } from 'octokit';
import { GitHubRepositoryMapper } from '../../application/mappers/GitHubRepositoryMapper';
import { getOwnerAndRepoName } from '../../application/utils/GitHubUtils';

/**
 * GitHubRepository class implements the RepositoryService interface for GitHub.
 * It provides methods to interact with GitHub repositories.
 */
export class GitHubRepository implements RepositoryService {
  private readonly octokit: Octokit;
  private readonly organization: string;

  /**
   * Creates an instance of GitHubRepository.
   * @param {string} token - The GitHub personal access token for authentication.
   * @param {string} organization - The GitHub organization name.
   */
  constructor(token: string, organization: string) {
    this.octokit = new Octokit({ auth: token });
    this.organization = organization;
  }

  /**
   * Retrieves a list of all repositories in the GitHub organization.
   * @returns {Promise<Repository[]>} A promise that resolves to an array of Repository objects.
   * @throws {Error} If the organization is not found.
   */
  async listRepositories(): Promise<Repository[]> {
    try {
      const response = await this.octokit.paginate({
        org: this.organization,
        method: 'GET',
        url: '/orgs/{org}/repos',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      return response.map(GitHubRepositoryMapper.toRepository);
    } catch (error) {
      throw new Error('Failed to list GitHub repositories: ' + error);
    }
  }

  /**
   * Retrieves details of a specific repository.
   * @param {string} repositoryId - The ID of the repository to fetch details for.
   * @returns {Promise<Repository>} A promise that resolves to a Repository object.
   * @throws {Error} If the repository is not found.
   */
  async getRepositoryDetails(repositoryId: string): Promise<Repository> {
    try {
      const repos = await this.listRepositories();
      const [owner, repoName] = await getOwnerAndRepoName(repos, repositoryId);
      const response = await this.octokit.request('GET /repos/{owner}/{repo}', {
        owner,
        repo: repoName,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      return GitHubRepositoryMapper.toRepository(response.data);
    } catch (error) {
      throw new Error(`Failed to get GitHub repository details for ID ${repositoryId}: ${error}`);
    }
  }
}
