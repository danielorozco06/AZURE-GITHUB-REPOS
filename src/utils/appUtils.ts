import { Repository } from '../domain/models/Repository';
import { RepositoryServiceFactory } from '../infrastructure/factories/RepositoryServiceFactory';
import { ListRepositoriesUseCase } from '../application/use-cases/ListRepositoriesUseCase';

/**
 * Loads configuration from environment variables based on the repository provider.
 * @returns {Object} An object containing the configuration values.
 * @property {string} repoProvider - The repository provider ('Azure' or 'GitHub').
 * @property {string} org - The organization URL (Azure) or name (GitHub).
 * @property {string} token - The access token for the selected provider.
 * @throws {Error} If any required environment variable is missing.
 */
export function loadConfig(): {
  repoProvider: string;
  org: string;
  token: string;
} {
  const repoProvider = process.env.REPO_PROVIDER?.toLowerCase();
  let org, token;

  switch (repoProvider) {
    case 'azure':
      org = process.env.AZURE_DEVOPS_ORG_URL;
      token = process.env.AZURE_DEVOPS_PAT;
      break;
    case 'github':
      org = process.env.GITHUB_ORG;
      token = process.env.GITHUB_TOKEN;
      break;
    default:
      throw new Error(`Unsupported repository provider: ${repoProvider}`);
  }

  if (!repoProvider || !org || !token) {
    throw new Error(`Missing environment variables for ${repoProvider}`);
  }

  return { repoProvider, org, token };
}

/**
 * Initializes repository use cases with the provided configuration.
 * @param repoProvider The repository provider ('Azure' or 'GitHub').
 * @param org The organization URL (Azure) or name (GitHub).
 * @param token The access token for the selected provider.
 * @returns An instance of ListRepositoriesUseCase.
 */
export function initializeRepositories(repoProvider: string, org: string, token: string): ListRepositoriesUseCase {
  const repositoryService = RepositoryServiceFactory.create(repoProvider, org, token);
  return new ListRepositoriesUseCase(repositoryService);
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
    switch (provider.toLowerCase()) {
      case 'azure':
        console.log(`  Proyecto: ${repo.project}`);
        console.log(`  Rama Predeterminada: ${repo.defaultBranch}`);
        console.log(`  Tamaño: ${repo.size} KB`);
        break;
      case 'github':
        console.log(`  Rama Predeterminada: ${repo.defaultBranch}`);
        console.log(`  Tamaño: ${repo.size} KB`);
        break;
      default:
        console.log('Proveedor no reconocido');
    }
  });
}
