// types/index.ts
export interface Employee {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
