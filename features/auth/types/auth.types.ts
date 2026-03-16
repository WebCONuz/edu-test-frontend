export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: "super_admin" | "admin" | "teacher";
  fullName: string;
}

export interface LoginResponse {
  id: string;
  fullName: string;
  email: string;
  role: "super_admin" | "admin" | "teacher";
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}
