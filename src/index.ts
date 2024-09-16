import { loadConfig, initializeRepositories, formatRepositoryOutput } from './utils/appUtils';

async function main() {
  try {
    const config = loadConfig();
    const { listAzureRepositoriesUseCase, listGitHubRepositoriesUseCase } = initializeRepositories(config);

    const azureRepositories = await listAzureRepositoriesUseCase.execute();
    formatRepositoryOutput(azureRepositories, 'Azure');

    const gitHubRepositories = await listGitHubRepositoriesUseCase.execute();
    formatRepositoryOutput(gitHubRepositories, 'GitHub');
  } catch (error) {
    console.error('Error al listar repositorios:', error);
  }
}

main();
