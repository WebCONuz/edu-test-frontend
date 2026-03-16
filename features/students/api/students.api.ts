import { fetcher } from "@/lib/fetcher";
import type {
  CheckPhoneDto,
  CheckPhoneResponse,
  CreateStudentDto,
  Student,
  StartSessionDto,
  StartSessionResponse,
  MyResultsResponse,
} from "../types/student.types";

export const studentsApi = {
  checkPhone: (data: CheckPhoneDto) =>
    fetcher<CheckPhoneResponse>("/students/check-phone", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createStudent: (data: CreateStudentDto) =>
    fetcher<Student>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  startSession: (data: StartSessionDto) =>
    fetcher<StartSessionResponse>("/sessions/start", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyResults: (phone: string) =>
    fetcher<MyResultsResponse>("/students/my-results", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
};
