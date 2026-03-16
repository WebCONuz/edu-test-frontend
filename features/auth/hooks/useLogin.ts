import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import type { LoginDto } from "../types/auth.types";
import { useAuthStore } from "../store/auth.store";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuthStore(); // ← hook ichida bo'lishi kerak

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (response) => {
      setUser(response);
      console.log(response);

      if (response.role === "teacher") {
        router.push("/teacher/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}
