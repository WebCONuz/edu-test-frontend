export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: "super_admin" | "admin" | "teacher";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    fullName: string;
  } | null;
}

export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "teacher";
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  password?: string;
  role?: "admin" | "teacher";
}

export interface AdminStudent {
  id: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  testSessions: {
    id: string;
    score: number | null;
    percentage: string | null;
    finishedAt: string | null;
    subject: {
      name: string;
    };
  }[];
}

export interface AdminSession {
  id: string;
  requestedCount: number;
  actualCount: number;
  score: number | null;
  percentage: string | null;
  startedAt: string;
  finishedAt: string | null;
  durationSec: number | null;
  student: {
    id: string;
    fullName: string;
    phone: string;
  };
  subject: {
    id: string;
    name: string;
  };
}
