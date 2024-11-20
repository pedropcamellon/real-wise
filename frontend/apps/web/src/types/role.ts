export type UserRole = 'user' | 'agent' | 'admin'

export interface User {
  username: string;
  first_name: string;
  last_name: string;
  roles: UserRole[];
}