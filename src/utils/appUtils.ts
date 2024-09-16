import { ListGitHubRepositoriesUseCase } from '../application/use-cases/ListGitHubRepositoriesUseCase';
import { ListAzureRepositoriesUseCase } from '../application/use-cases/ListAzureRepositoriesUseCase';
import { Repository } from '../domain/models/Repository';
import { AzureRepository } from '../infrastructure/repositories/AzureRepository';
import { GitHubRepository } from '../infrastructure/repositories/GitHubRepository';

/**
 * Loads configuration from environment variables.
 * @returns {Object} An object containing the configuration values.
 * @property {string} azureOrgUrl - The URL of the Azure DevOps organization.
 * @property {string} azureToken - The Personal Access Token for Azure DevOps.
 * @property {string} gitHubToken - The access token for GitHub.
 * @property {string} gitHubOrg - The name of the GitHub organization.
 * @throws {Error} If any required environment variable is missing.
 */
export function loadConfig(): {
  azureOrgUrl: string;
  azureToken: string;
  gitHubToken: string;
  gitHubOrg: string;
} {
  const azureOrgUrl = process.env.AZURE_DEVOPS_ORG_URL;
  const azureToken = process.env.AZURE_DEVOPS_PAT;
  const gitHubOrg = process.env.GITHUB_ORG;
  const gitHubToken = process.env.GITHUB_TOKEN;

  if (!azureOrgUrl || !azureToken || !gitHubToken || !gitHubOrg) {
    throw new Error('Set AZURE_DEVOPS_ORG_URL, AZURE_DEVOPS_PAT, GITHUB_TOKEN, and GITHUB_ORG as environment variables');
  }

  return { azureOrgUrl, azureToken, gitHubToken, gitHubOrg };
}

/**
 * Initializes repository use cases with the provided configuration.
 * @param config Configuration object containing Azure and GitHub credentials.
 * @returns Object containing initialized use cases for Azure and GitHub repositories.
 */
export function initializeRepositories(config: {
  azureOrgUrl: string;
  azureToken: string;
  gitHubToken: string;
  gitHubOrg: string;
}): {
  listAzureRepositoriesUseCase: ListAzureRepositoriesUseCase;
  listGitHubRepositoriesUseCase: ListGitHubRepositoriesUseCase;
} {
  const azureRepository = new AzureRepository(config.azureOrgUrl, config.azureToken);
  const listAzureRepositoriesUseCase = new ListAzureRepositoriesUseCase(azureRepository);

  const gitHubRepository = new GitHubRepository(config.gitHubToken, config.gitHubOrg);
  const listGitHubRepositoriesUseCase = new ListGitHubRepositoriesUseCase(gitHubRepository);

  return { listAzureRepositoriesUseCase, listGitHubRepositoriesUseCase };
}

/**
 * Formats and prints repository information to the console.
 * @param {Repository[]} repositories - Array of Repository objects to be formatted and printed.
 * @param {string} provider - The name of the repository provider (e.g., 'Azure' or 'GitHub').
 */
export function formatRepositoryOutput(repositories: Repository[], provider: string) {
  console.log(`\n--- Lista Detallada de Repositorios de ${provider} ---`);
  repositories.forEach(repo => {
    console.log(`\n- Nombre: ${repo.name}`);
    console.log(`  ID: ${repo.id}`);
    console.log(`  URL: ${repo.url}`);
    if (provider === 'Azure') {
      console.log(`  Proyecto: ${repo.project}`);
      console.log(`  Rama Predeterminada: ${repo.defaultBranch}`);
      console.log(`  Tamaño: ${repo.size} KB`);
    } else if (provider === 'GitHub') {
      console.log(`  Rama Predeterminada: ${repo.defaultBranch}`);
      console.log(`  Tamaño: ${repo.size} KB`);
    } else {
      console.log('Proveedor no reconocido');
    }
  });
}
