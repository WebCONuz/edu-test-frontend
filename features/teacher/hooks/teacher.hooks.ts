import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherApi } from "../api/teacher.api";
import type {
  CreateSubjectDto,
  UpdateSubjectDto,
  CreateQuestionDto,
  UpdateQuestionDto,
} from "../types/teacher.types";
import { useAuthStore } from "@/features/auth/store/auth.store";

// ===== SUBJECTS =====
export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: teacherApi.getSubjects,
  });
}

export function useFullSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: teacherApi.getFullSubjects,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubjectDto) => teacherApi.createSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubjectDto }) =>
      teacherApi.updateSubject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teacherApi.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

// ===== QUESTIONS =====
export function useQuestions(page = 1, limit = 30, subjectId?: string) {
  return useQuery({
    queryKey: ["questions", page, limit, subjectId],
    queryFn: () => teacherApi.getQuestions(page, limit, subjectId),
  });
}

export function useFullQuestions(page = 1, limit = 30, subjectId?: string) {
  return useQuery({
    queryKey: ["questions", page, limit, subjectId],
    queryFn: () => teacherApi.getFullQuestions(page, limit, subjectId),
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuestionDto) => teacherApi.createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionDto }) =>
      teacherApi.updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teacherApi.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useImportQuestions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subjectId, file }: { subjectId: string; file: File }) =>
      teacherApi.importQuestions(subjectId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

// O'z savollarini filter qilish uchun
export function useMyQuestions(page = 1, limit = 20, subjectId?: string) {
  const { user } = useAuthStore();
  const result = useQuestions(page, limit, subjectId);
  const myData =
    result.data?.data.filter((q) => q.createdBy.id === user?.id) ?? [];
  return {
    ...result,
    data: result.data ? { ...result.data, data: myData } : undefined,
  };
}

// O'z fanlarini filter qilish uchun (createdBy yo'q, hamma ko'radi)
export function useMySubjects() {
  return useSubjects();
}
