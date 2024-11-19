export interface UserRole {
  id: number;
  name: string;
  description: string;
  created_at: string;
  modified_at: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  roles: UserRole[];
}

export type RoleName = 'agent' | 'user';
