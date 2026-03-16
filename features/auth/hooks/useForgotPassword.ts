import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { ForgotPasswordDto } from "../types/auth.types";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordDto) => authApi.forgotPassword(data),
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}
