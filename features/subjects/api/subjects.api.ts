import { fetcher } from "@/lib/fetcher";
import type { Subject } from "../types/subject.types";

export const subjectsApi = {
  getAll: () => fetcher<Subject[]>("/subjects"),
};
