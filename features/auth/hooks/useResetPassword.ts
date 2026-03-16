import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import type { ResetPasswordByTokenDto } from "../types/auth.types";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordByTokenDto) =>
      authApi.resetPasswordByToken(data),
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}
