import { Repository } from '../models/Repository';

export interface RepositoryService {
  listRepositories(): Promise<Repository[]>;
  getRepositoryDetails(repositoryId: string): Promise<Repository>;
}
