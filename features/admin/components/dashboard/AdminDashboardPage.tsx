"use client";

import { useUsers } from "../../hooks/admin.hooks";
import { useStudents } from "../../hooks/admin.hooks";
import { useSessions } from "../../hooks/admin.hooks";
import {
  useFullSubjects,
  useFullQuestions,
} from "@/features/teacher/hooks/teacher.hooks";
import { useAuthStore } from "@/features/auth/store/auth.store";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  HelpCircle,
  BarChart3,
  TrendingUp,
} from "lucide-react";

export function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { data: users, isLoading: isLoadingUsers } = useUsers();
  const { data: students, isLoading: isLoadingStudents } = useStudents();
  const { data: sessions, isLoading: isLoadingSessions } = useSessions();
  const { data: subjects, isLoading: isLoadingSubjects } = useFullSubjects();
  const { data: questionsData, isLoading: isLoadingQuestions } =
    useFullQuestions(1, 100000000);
  const questions = questionsData?.data ?? [];

  const completedSessions = sessions?.filter((s) => s.finishedAt) ?? [];
  const avgPercentage = completedSessions.length
    ? Math.round(
        completedSessions
          .filter((s) => s.percentage)
          .reduce((sum, s) => sum + parseFloat(s.percentage!), 0) /
          completedSessions.filter((s) => s.percentage).length,
      )
    : 0;

  const activeStudents = students?.filter((s) => s.isActive) ?? [];
  const blockedStudents = students?.filter((s) => !s.isActive) ?? [];
  const activeQuestions = questions?.filter((q) => q.isActive) ?? [];
  const teachers = users?.filter((u) => u.role === "teacher") ?? [];
  const admins = users?.filter((u) => u.role === "admin") ?? [];

  const stats = [
    {
      label: "Jami fanlar",
      value: isLoadingSubjects ? "..." : (subjects?.length ?? 0),
      icon: BookOpen,
      color: "#3b82f6",
      bg: "#eff6ff",
      href: "/admin/subjects",
    },
    {
      label: "Jami savollar",
      value: isLoadingQuestions ? "..." : activeQuestions.length,
      icon: HelpCircle,
      color: "#8b5cf6",
      bg: "#f5f3ff",
      href: "/admin/questions",
    },
    {
      label: "Jami studentlar",
      value: isLoadingStudents ? "..." : activeStudents.length,
      icon: GraduationCap,
      color: "#10b981",
      bg: "#ecfdf5",
      href: "/admin/students",
    },
    {
      label: "Jami sessiyalar",
      value: isLoadingSessions ? "..." : (sessions?.length ?? 0),
      icon: BarChart3,
      color: "#f59e0b",
      bg: "#fffbeb",
      href: "/admin/sessions",
    },
    {
      label: "Foydalanuvchilar",
      value: isLoadingUsers ? "..." : (users?.length ?? 0),
      icon: Users,
      color: "#ef4444",
      bg: "#fef2f2",
      href: "/admin/users",
    },
    {
      label: "O'rtacha ball",
      value: isLoadingSessions ? "..." : `${avgPercentage}%`,
      icon: TrendingUp,
      color: "#06b6d4",
      bg: "#ecfeff",
      href: "/admin/sessions",
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
          Xush kelibsiz, {user?.fullName?.split(" ")[0]} 👋
        </h2>
        <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
          Platformaning umumiy ko'rinishi
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} style={{ textDecoration: "none" }}>
            <div
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 20,
                transition: "box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 2px 12px rgba(0,0,0,0.08)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <stat.icon
                  style={{ width: 20, height: 20, color: stat.color }}
                />
              </div>
              <p
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  marginBottom: 4,
                  color: "var(--foreground)",
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Qo'shimcha statistika */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Foydalanuvchilar taqsimoti */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Foydalanuvchilar
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Super Admin", count: 1, color: "#ef4444" },
              { label: "Adminlar", count: admins.length, color: "#f59e0b" },
              { label: "Teacherlar", count: teachers.length, color: "#3b82f6" },
            ].map((item, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{ fontSize: 13, color: "var(--muted-foreground)" }}
                  >
                    {item.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {item.count}
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    backgroundColor: "var(--muted)",
                    borderRadius: 999,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 999,
                      backgroundColor: item.color,
                      width: users?.length
                        ? `${(item.count / users.length) * 100}%`
                        : "0%",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Studentlar holati */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Studentlar holati
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Faol", count: activeStudents.length, color: "#10b981" },
              {
                label: "Bloklangan",
                count: blockedStudents.length,
                color: "#ef4444",
              },
            ].map((item, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{ fontSize: 13, color: "var(--muted-foreground)" }}
                  >
                    {item.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {item.count}
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    backgroundColor: "var(--muted)",
                    borderRadius: 999,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 999,
                      backgroundColor: item.color,
                      width: students?.length
                        ? `${(item.count / students.length) * 100}%`
                        : "0%",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* So'nggi sessiyalar */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            So'nggi sessiyalar
          </h3>
          {isLoadingSessions ? (
            <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
              Yuklanmoqda...
            </p>
          ) : sessions?.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
              Hali sessiya yo'q
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sessions?.slice(0, 4).map((s) => {
                const pct = s.percentage ? parseFloat(s.percentage) : null;
                return (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      paddingBottom: 10,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: s.finishedAt ? "#10b981" : "#f59e0b",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {s.student.fullName}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {s.subject.name}
                      </p>
                    </div>
                    {pct !== null && (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color:
                            pct >= 80
                              ? "#10b981"
                              : pct >= 50
                                ? "#f59e0b"
                                : "#ef4444",
                        }}
                      >
                        {Math.round(pct)}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tezkor harakatlar */}
      <div
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
          Tezkor harakatlar
        </h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { href: "/admin/users", label: "+ Yangi admin", color: "#ef4444" },
            { href: "/admin/subjects", label: "+ Yangi fan", color: "#3b82f6" },
            {
              href: "/admin/questions",
              label: "+ Yangi savol",
              color: "#8b5cf6",
            },
            {
              href: "/admin/questions?tab=import",
              label: "↑ Fayl import",
              color: "#10b981",
            },
            {
              href: "/admin/students",
              label: "👥 Studentlar",
              color: "#f59e0b",
            },
            {
              href: "/admin/sessions",
              label: "📊 Sessiyalar",
              color: "#06b6d4",
            },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: action.color,
                backgroundColor: `${action.color}14`,
                border: `1px solid ${action.color}30`,
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
