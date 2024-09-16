import { Repository } from '../../domain/models/Repository';
import { RepositoryService } from '../../domain/services/RepositoryService';
import { Octokit } from 'octokit';

export class GitHubRepository implements RepositoryService {
  private readonly octokit: Octokit;
  private readonly organization: string;

  constructor(token: string, organization: string) {
    this.octokit = new Octokit({ auth: token });
    this.organization = organization;
  }

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
