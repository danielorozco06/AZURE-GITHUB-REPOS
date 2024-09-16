import { Repository } from '../../domain/models/Repository';

/**
 * Retrieves the owner and repository name from a list of repositories based on the repository ID.
 *
 * @param {Repository[]} repositories - An array of Repository objects to search through.
 * @param {string} repositoryId - The ID of the repository to find.
 * @returns {Promise<[string, string]>} A promise that resolves to a tuple containing the owner and repository name.
 * @throws {Error} If the repository with the given ID is not found in the list.
 */
export async function getOwnerAndRepoName(repositories: Repository[], repositoryId: string): Promise<[string, string]> {
  const repo = repositories.find(r => r.id === repositoryId);
  if (!repo) {
    throw new Error(`Repository not found for ID ${repositoryId}`);
  }
  return repo.url.split('/').slice(-2) as [string, string];
}
