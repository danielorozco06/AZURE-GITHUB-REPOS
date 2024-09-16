import { loadConfig, initializeRepositories, formatRepositoryOutput } from './utils/appUtils';

async function main() {
  try {
    const config = loadConfig();
    const listRepositoriesUseCase = initializeRepositories(config.repoProvider, config.org, config.token);

    const repositories = await listRepositoriesUseCase.execute();
    formatRepositoryOutput(repositories, config.repoProvider);
  } catch (error) {
    console.error('Error al listar repositorios:', error);
  }
}

main();
