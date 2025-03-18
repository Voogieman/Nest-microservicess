export interface User {
  id: string;
  email: string;
  role: UserRole;
  refreshToken?: string | null; // Можно опустить, если будем использовать Omit
  password?: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
