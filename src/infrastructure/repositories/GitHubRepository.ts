import { Repository } from '../../domain/models/Repository';
import { RepositoryService } from '../../domain/services/RepositoryService';
import { Octokit } from 'octokit';

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

      return response.map((repo: any) => ({
        id: repo.id.toString(),
        name: repo.name,
        url: repo.html_url,
        provider: 'GitHub'
      }));
    } catch (error) {
      console.error('Error al listar repositorios de GitHub:', error);
      return [];
    }
  }

  /**
   * Retrieves details of a specific repository.
   * @param {string} repositoryId - The ID of the repository to fetch details for.
   * @returns {Promise<Repository>} A promise that resolves to a Repository object.
   * @throws {Error} If the repository is not found.
   */
  async getRepositoryDetails(repositoryId: string): Promise<Repository> {
    const repos = await this.listRepositories();
    const repo = repos.find(r => r.id === repositoryId);
    if (!repo) {
      throw new Error('Repositorio no encontrado');
    }

    const [owner, repoName] = repo.url.split('/').slice(-2);
    const response = await this.octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo: repoName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return {
      ...repo,
      defaultBranch: response.data.default_branch,
      size: response.data.size
    };
  }
}
