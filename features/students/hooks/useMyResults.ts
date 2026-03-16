import { useMutation } from "@tanstack/react-query";
import { studentsApi } from "../api/students.api";

export function useMyResults() {
  return useMutation({
    mutationFn: (phone: string) => studentsApi.getMyResults(phone),
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}
