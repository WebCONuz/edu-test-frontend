import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "../api/subjects.api";

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => subjectsApi.getAll(),
  });
}
