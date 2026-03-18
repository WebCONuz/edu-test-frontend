import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import type { RegisterDto } from "../types/auth.types";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: () => {
      router.push("/teacher/dashboard");
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}
