export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  token: string;
}
