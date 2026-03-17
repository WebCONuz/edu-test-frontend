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
export function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: teacherApi.getQuestions,
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
export function useMyQuestions() {
  const { user } = useAuthStore();
  const { data, ...rest } = useQuestions();

  const myQuestions = data?.filter((q) => q.createdBy.id === user?.id) ?? [];

  return { data: myQuestions, ...rest };
}

// O'z fanlarini filter qilish uchun (createdBy yo'q, hamma ko'radi)
export function useMySubjects() {
  return useSubjects();
}
