export interface Repository {
  id: string;
  name: string;
  url: string;
  project?: string;
  defaultBranch?: string;
  size?: number;
  provider: 'Azure' | 'GitHub';
}
