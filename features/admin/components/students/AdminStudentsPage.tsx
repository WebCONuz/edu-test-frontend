"use client";

import { useState } from "react";
import {
  useStudents,
  useBlockStudent,
  useUnblockStudent,
} from "../../hooks/admin.hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  GraduationCap,
  Loader2,
  Ban,
  ChevronDown,
  ChevronUp,
  Phone,
  CheckCircle,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import type { AdminStudent } from "../../types/admin.types";

export function AdminStudentsPage() {
  const { data: students, isLoading } = useStudents();
  const { mutate: blockStudent, isPending: isBlocking } = useBlockStudent();

  const { mutate: unblockStudent, isPending: isUnblocking } =
    useUnblockStudent();
  const [search, setSearch] = useState("");

  const [blockId, setBlockId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "blocked"
  >("all");

  const filteredStudents = students?.filter((s) => {
    const matchStatus =
      filterActive === "active"
        ? s.isActive
        : filterActive === "blocked"
          ? !s.isActive
          : true;
    const matchSearch = search.trim()
      ? s.fullName.toLowerCase().includes(search.toLowerCase()) ||
        s.phone.includes(search)
      : true;
    return matchStatus && matchSearch;
  });

  const handleBlock = () => {
    if (!blockId) return;
    blockStudent(blockId, { onSuccess: () => setBlockId(null) });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getAvgPercentage = (student: AdminStudent) => {
    const completed = student.testSessions.filter((s) => s.percentage !== null);
    if (!completed.length) return null;
    return Math.round(
      completed.reduce((sum, s) => sum + parseFloat(s.percentage!), 0) /
        completed.length,
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 2 }}>
            Umumiy studentlar ro'yxati
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
            Jami {students?.length ?? 0} ta student
          </p>
        </div>

        {/* Search */}
        <Input
          placeholder="Ism yoki telefon qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            borderRadius: 8,
            height: 36,
            width: 350,
            fontSize: 13,
            backgroundColor: "#fff",
          }}
        />

        {/* Filter */}
        <div style={{ display: "flex", gap: 4 }}>
          {(
            [
              { value: "all", label: "Barchasi" },
              { value: "active", label: "Faol" },
              { value: "blocked", label: "Bloklangan" },
            ] as const
          ).map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterActive(f.value)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                backgroundColor:
                  filterActive === f.value ? "var(--primary)" : "var(--card)",
                color:
                  filterActive === f.value
                    ? "var(--primary-foreground)"
                    : "var(--foreground)",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Students list */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Loader2
            style={{
              width: 24,
              height: 24,
              color: "var(--muted-foreground)",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      ) : filteredStudents?.length === 0 ? (
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 48,
            textAlign: "center",
          }}
        >
          <GraduationCap
            style={{
              width: 32,
              height: 32,
              color: "var(--muted-foreground)",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ fontSize: 15, fontWeight: 500 }}>Student topilmadi</p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {filteredStudents?.map((student, i) => {
            const isExpanded = expandedId === student.id;
            const avgPct = getAvgPercentage(student);
            const completedSessions = student.testSessions.filter(
              (s) => s.finishedAt,
            );

            return (
              <div
                key={student.id}
                style={{
                  borderBottom:
                    i < (filteredStudents?.length ?? 0) - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                {/* Student row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 20px",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: student.isActive
                        ? "color-mix(in srgb, var(--primary) 15%, transparent)"
                        : "var(--muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: student.isActive
                          ? "var(--primary)"
                          : "var(--muted-foreground)",
                      }}
                    >
                      {student.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 3,
                      }}
                    >
                      <p style={{ fontSize: 14, fontWeight: 500 }}>
                        {student.fullName}
                      </p>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: student.isActive ? "#10b981" : "#ef4444",
                          backgroundColor: student.isActive
                            ? "#ecfdf5"
                            : "#fef2f2",
                          border: `1px solid ${student.isActive ? "#a7f3d0" : "#fecaca"}`,
                          padding: "1px 6px",
                          borderRadius: 999,
                        }}
                      >
                        {student.isActive ? "Faol" : "Bloklangan"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        <Phone style={{ width: 11, height: 11 }} />
                        {student.phone}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {completedSessions.length} ta test
                      </span>
                      {avgPct !== null && (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color:
                              avgPct >= 80
                                ? "#10b981"
                                : avgPct >= 50
                                  ? "#f59e0b"
                                  : "#ef4444",
                          }}
                        >
                          O'rtacha: {avgPct}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {student.testSessions.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : student.id)
                        }
                        style={{
                          borderRadius: 6,
                          width: 32,
                          height: 32,
                          padding: 0,
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp style={{ width: 14, height: 14 }} />
                        ) : (
                          <ChevronDown style={{ width: 14, height: 14 }} />
                        )}
                      </Button>
                    )}
                    {student.isActive ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBlockId(student.id)}
                        style={{
                          borderRadius: 6,
                          height: 32,
                          padding: "0 10px",
                          color: "var(--destructive)",
                          fontSize: 12,
                          gap: 4,
                        }}
                      >
                        <Ban style={{ width: 13, height: 13 }} />
                        Bloklash
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => unblockStudent(student.id)}
                        disabled={isUnblocking}
                        style={{
                          borderRadius: 6,
                          height: 32,
                          padding: "0 10px",
                          color: "#10b981",
                          fontSize: 12,
                          gap: 4,
                          border: "1px solid #10b981",
                        }}
                      >
                        {isUnblocking ? (
                          <Loader2
                            style={{
                              width: 13,
                              height: 13,
                              animation: "spin 1s linear infinite",
                            }}
                          />
                        ) : (
                          <ShieldCheck style={{ width: 13, height: 13 }} />
                        )}
                        Faollashtirish
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded — test sessions */}
                {isExpanded && (
                  <div style={{ padding: "0 20px 16px 68px" }}>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--muted-foreground)",
                        marginBottom: 8,
                      }}
                    >
                      Test sessiyalari:
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {student.testSessions.map((session) => {
                        const pct = session.percentage
                          ? parseFloat(session.percentage)
                          : null;
                        return (
                          <div
                            key={session.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "8px 12px",
                              borderRadius: 8,
                              backgroundColor: "var(--muted)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {session.finishedAt ? (
                              <CheckCircle
                                style={{
                                  width: 14,
                                  height: 14,
                                  color: "#10b981",
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <XCircle
                                style={{
                                  width: 14,
                                  height: 14,
                                  color: "var(--muted-foreground)",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <span style={{ fontSize: 13, flex: 1 }}>
                              {session.subject.name}
                            </span>
                            {pct !== null ? (
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
                            ) : (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                Yakunlanmagan
                              </span>
                            )}
                            {session.finishedAt && (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--muted-foreground)",
                                }}
                              >
                                {formatDate(session.finishedAt)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Block Alert */}
      <AlertDialog open={!!blockId} onOpenChange={() => setBlockId(null)}>
        <AlertDialogContent className="max-w-md" style={{ borderRadius: 16 }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Studentni bloklash</AlertDialogTitle>
            <AlertDialogDescription>
              Bu studentni bloklashni tasdiqlaysizmi? Student tizimdan foydalana
              olmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderRadius: 8 }}>
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlock}
              disabled={isBlocking}
              style={{
                borderRadius: 8,
                backgroundColor: "var(--destructive)",
                color: "white",
              }}
            >
              {isBlocking ? (
                <Loader2
                  style={{
                    width: 16,
                    height: 16,
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : (
                "Bloklash"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
