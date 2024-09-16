import { ListGitHubRepositoriesUseCase } from '../application/use-cases/ListGitHubRepositoriesUseCase';
import { ListAzureRepositoriesUseCase } from '../application/use-cases/ListAzureRepositoriesUseCase';
import { Repository } from '../domain/models/Repository';
import { AzureRepository } from '../infrastructure/repositories/AzureRepository';
import { GitHubRepository } from '../infrastructure/repositories/GitHubRepository';

export function loadConfig() {
  const azureOrgUrl = process.env.AZURE_DEVOPS_ORG_URL;
  const azureToken = process.env.AZURE_DEVOPS_PAT;
  const gitHubOrg = process.env.GITHUB_ORG;
  const gitHubToken = process.env.GITHUB_TOKEN;

  if (!azureOrgUrl || !azureToken || !gitHubToken || !gitHubOrg) {
    throw new Error('Set ORG_URL, PAT, GITHUB_TOKEN y GITHUB_ORG like environment variables');
  }

  return { azureOrgUrl, azureToken, gitHubToken, gitHubOrg };
}

export function initializeRepositories(config: {
  azureOrgUrl: string;
  azureToken: string;
  gitHubToken: string;
  gitHubOrg: string;
}) {
  const azureRepository = new AzureRepository(config.azureOrgUrl, config.azureToken);
  const listAzureRepositoriesUseCase = new ListAzureRepositoriesUseCase(azureRepository);

  const gitHubRepository = new GitHubRepository(config.gitHubToken, config.gitHubOrg);
  const listGitHubRepositoriesUseCase = new ListGitHubRepositoriesUseCase(gitHubRepository);

  return { listAzureRepositoriesUseCase, listGitHubRepositoriesUseCase };
}

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
