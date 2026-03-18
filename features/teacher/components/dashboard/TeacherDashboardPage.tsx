"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { BookOpen, HelpCircle, FileInput } from "lucide-react";
import Link from "next/link";
import { useMyQuestions, useSubjects } from "../../hooks/teacher.hooks";
import { MathText } from "@/shared/components/MathText";

export function TeacherDashboardPage() {
  const { user } = useAuthStore();
  const { data: questionsData, isLoading: isLoadingQuestions } = useMyQuestions(
    1,
    10000000,
    undefined,
  );
  const questions = questionsData?.data ?? [];
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjects();

  // const activeQuestions = questions?.filter((q) => q.isActive) ?? [];
  // const inactiveQuestions = questions?.filter((q) => !q.isActive) ?? [];
  const importedQuestions =
    questions?.filter((q) => q.source === "file_import") ?? [];
  const manualQuestions =
    questions?.filter((q) => q.source !== "file_import") ?? [];

  const stats = [
    {
      label: "Jami fanlar",
      value: isLoadingSubjects ? "..." : (subjects?.length ?? 0),
      icon: BookOpen,
      color: "#3b82f6",
      bg: "#eff6ff",
      href: "/teacher/subjects",
    },
    {
      label: "Mening savollarim",
      value: isLoadingQuestions ? "..." : (questions?.length ?? 0),
      icon: HelpCircle,
      color: "#8b5cf6",
      bg: "#f5f3ff",
      href: "/teacher/questions",
    },
    // {
    //   label: "Faol savollar",
    //   value: isLoadingQuestions ? "..." : activeQuestions.length,
    //   icon: CheckCircle,
    //   color: "#10b981",
    //   bg: "#ecfdf5",
    //   href: "/teacher/questions",
    // },
    // {
    //   label: "Nofaol savollar",
    //   value: isLoadingQuestions ? "..." : inactiveQuestions.length,
    //   icon: Clock,
    //   color: "#f59e0b",
    //   bg: "#fffbeb",
    //   href: "/teacher/questions",
    // },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
          Xush kelibsiz, {user?.fullName?.split(" ")[0]} 👋
        </h2>
        <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
          Sizning faoliyatingiz umumiy ko'rinishi
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
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
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Savol manbalari */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Savol manbalari
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileInput
                  style={{
                    width: 16,
                    height: 16,
                    color: "var(--muted-foreground)",
                  }}
                />
                <span
                  style={{ fontSize: 14, color: "var(--muted-foreground)" }}
                >
                  Fayl import
                </span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {importedQuestions.length}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 6,
                backgroundColor: "var(--muted)",
                borderRadius: 999,
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: "#8b5cf6",
                  width: questions?.length
                    ? `${(importedQuestions.length / questions.length) * 100}%`
                    : "0%",
                  transition: "width 0.3s",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <HelpCircle
                  style={{
                    width: 16,
                    height: 16,
                    color: "var(--muted-foreground)",
                  }}
                />
                <span
                  style={{ fontSize: 14, color: "var(--muted-foreground)" }}
                >
                  Qo'lda kiritilgan
                </span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {manualQuestions.length}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 6,
                backgroundColor: "var(--muted)",
                borderRadius: 999,
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: "#3b82f6",
                  width: questions?.length
                    ? `${(manualQuestions.length / questions.length) * 100}%`
                    : "0%",
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        </div>

        {/* So'nggi savollar */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            So'nggi savollar
          </h3>
          {isLoadingQuestions ? (
            <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
              Yuklanmoqda...
            </p>
          ) : questions?.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
              Hali savol yo'q
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {questions?.slice(0, 4).map((q) => (
                <div
                  key={q.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: q.isActive ? "#10b981" : "#f59e0b",
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: 2,
                      }}
                    >
                      <MathText text={q.questionText} />
                    </p>
                    <p
                      style={{ fontSize: 11, color: "var(--muted-foreground)" }}
                    >
                      {q.subject.name}
                    </p>
                  </div>
                </div>
              ))}
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
            {
              href: "/teacher/subjects",
              label: "+ Yangi fan",
              color: "#3b82f6",
            },
            {
              href: "/teacher/questions",
              label: "+ Yangi savol",
              color: "#8b5cf6",
            },
            {
              href: "/teacher/questions?tab=import",
              label: "↑ Fayl import",
              color: "#10b981",
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
