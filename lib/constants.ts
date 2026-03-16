export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3030/api";

export const ROUTES = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_SUBJECTS: "/admin/subjects",
  ADMIN_QUESTIONS: "/admin/questions",
  ADMIN_SESSIONS: "/admin/sessions",
  ADMIN_STUDENTS: "/admin/students",

  // Teacher
  TEACHER_DASHBOARD: "/teacher/dashboard",
  TEACHER_SUBJECTS: "/teacher/subjects",
  TEACHER_QUESTIONS: "/teacher/questions",

  // Student
  STUDENT_HOME: "/student",
  STUDENT_TEST: "/student/test",
  STUDENT_RESULT: "/student/result",
} as const;
