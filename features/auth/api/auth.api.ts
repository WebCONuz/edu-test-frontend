import { fetcher } from "@/lib/fetcher";
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  ResetPasswordByTokenDto,
  ResetPasswordByTokenResponse,
} from "../types/auth.types";

export const authApi = {
  login: (data: LoginDto) =>
    fetcher<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterDto) =>
    fetcher<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  forgotPassword: (data: ForgotPasswordDto) =>
    fetcher<ForgotPasswordResponse>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resetPasswordByToken: (data: ResetPasswordByTokenDto) =>
    fetcher<ResetPasswordByTokenResponse>("/auth/reset-password/token", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
