import { fetcher } from "@/lib/fetcher";
import type {
  Question,
  Subject,
  CreateSubjectDto,
  UpdateSubjectDto,
  CreateQuestionDto,
  UpdateQuestionDto,
} from "../types/teacher.types";

export const teacherApi = {
  // Subjects
  getSubjects: () => fetcher<Subject[]>("/subjects"),

  createSubject: (data: CreateSubjectDto) =>
    fetcher<Subject>("/subjects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSubject: (id: string, data: UpdateSubjectDto) =>
    fetcher<Subject>(`/subjects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteSubject: (id: string) =>
    fetcher<Subject>(`/subjects/${id}`, {
      method: "DELETE",
    }),

  // Questions
  getQuestions: () => fetcher<Question[]>("/questions"),

  getQuestionsBySubject: (subjectId: string) =>
    fetcher<Question[]>(`/questions/by-subject/${subjectId}`),

  createQuestion: (data: CreateQuestionDto) =>
    fetcher<Question>("/questions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuestion: (id: string, data: UpdateQuestionDto) =>
    fetcher<Question>(`/questions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteQuestion: (id: string) =>
    fetcher<Question>(`/questions/${id}`, {
      method: "DELETE",
    }),

  importQuestions: (subjectId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectId", subjectId);
    return fetcher<{
      message: string;
      total: number;
      saved: number;
      skipped: number;
    }>("/questions/import", {
      method: "POST",
      body: formData,
      headers: {},
    });
  },
};
