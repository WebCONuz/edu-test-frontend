import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/admin.api";
import type { CreateUserDto, UpdateUserDto } from "../types/admin.types";

// ===== USERS =====
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: adminApi.getUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserDto) => adminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// ===== STUDENTS =====
export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: adminApi.getStudents,
  });
}

export function useBlockStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.blockStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUnblockStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.unblockStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

// ===== SESSIONS =====
export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: adminApi.getSessions,
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: ["sessions", id],
    queryFn: () => adminApi.getSession(id),
    enabled: !!id,
  });
}
