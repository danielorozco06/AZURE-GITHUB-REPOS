/**
 * Represents a repository from either Azure DevOps or GitHub.
 */
export interface Repository {
  /** Unique identifier of the repository */
  id: string;
  /** Name of the repository */
  name: string;
  /** URL of the repository */
  url: string;
  /** Name of the project (for Azure DevOps repositories) */
  project?: string;
  /** Name of the default branch */
  defaultBranch?: string;
  /** Size of the repository in KB */
  size?: number;
  /** The service provider of the repository */
  provider: 'Azure' | 'GitHub';
}
