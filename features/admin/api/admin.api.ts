import { fetcher } from "@/lib/fetcher";
import type {
  AdminUser,
  AdminStudent,
  AdminSession,
  CreateUserDto,
  UpdateUserDto,
} from "../types/admin.types";

export const adminApi = {
  // Users
  getUsers: () => fetcher<AdminUser[]>("/users"),

  createUser: (data: CreateUserDto) =>
    fetcher<AdminUser>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateUser: (id: string, data: UpdateUserDto) =>
    fetcher<AdminUser>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteUser: (id: string) =>
    fetcher<AdminUser>(`/users/${id}`, {
      method: "DELETE",
    }),

  // Students
  getStudents: () => fetcher<AdminStudent[]>("/students"),

  blockStudent: (id: string) =>
    fetcher<AdminStudent>(`/students/${id}`, {
      method: "DELETE",
    }),

  unblockStudent: (id: string) =>
    fetcher<AdminStudent>(`/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: true }),
    }),

  // Sessions
  getSessions: () => fetcher<AdminSession[]>("/sessions"),

  getSession: (id: string) => fetcher<AdminSession>(`/sessions/${id}`),
};
