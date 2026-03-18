"use client";

import { useState } from "react";
import { useSessions } from "../../hooks/admin.hooks";
import {
  Loader2,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  BookOpen,
} from "lucide-react";
import { Input } from "../../../../components/ui/input";

export function AdminSessionsPage() {
  const { data: sessions, isLoading } = useSessions();
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending"
  >("all");
  const [search, setSearch] = useState("");

  const subjects = Array.from(
    new Map(sessions?.map((s) => [s.subject.id, s.subject])).values(),
  );

  const filteredSessions = sessions?.filter((s) => {
    const matchSubject = filterSubject ? s.subject.id === filterSubject : true;
    const matchStatus =
      filterStatus === "completed"
        ? s.finishedAt !== null
        : filterStatus === "pending"
          ? s.finishedAt === null
          : true;
    const matchSearch = search.trim()
      ? s.student.fullName.toLowerCase().includes(search.toLowerCase()) ||
        s.student.phone.includes(search)
      : true;
    return matchSubject && matchStatus && matchSearch;
  });

  const completedSessions = sessions?.filter((s) => s.finishedAt) ?? [];
  const avgPct = completedSessions.length
    ? Math.round(
        completedSessions
          .filter((s) => s.percentage)
          .reduce((sum, s) => sum + parseFloat(s.percentage!), 0) /
          completedSessions.filter((s) => s.percentage).length,
      )
    : 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Jami sessiyalar",
            value: sessions?.length ?? 0,
            icon: BarChart3,
            color: "#3b82f6",
            bg: "#eff6ff",
          },
          {
            label: "Yakunlangan",
            value: completedSessions.length,
            icon: CheckCircle,
            color: "#10b981",
            bg: "#ecfdf5",
          },
          {
            label: "Yakunlanmagan",
            value: (sessions?.length ?? 0) - completedSessions.length,
            icon: XCircle,
            color: "#f59e0b",
            bg: "#fffbeb",
          },
          {
            label: "O'rtacha ball",
            value: `${avgPct}%`,
            icon: BarChart3,
            color: "#8b5cf6",
            bg: "#f5f3ff",
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <stat.icon style={{ width: 18, height: 18, color: stat.color }} />
            </div>
            <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* Status filter */}
        <div style={{ display: "flex", gap: 4 }}>
          {(
            [
              { value: "all", label: "Barchasi" },
              { value: "completed", label: "Yakunlangan" },
              { value: "pending", label: "Yakunlanmagan" },
            ] as const
          ).map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                backgroundColor:
                  filterStatus === f.value ? "var(--primary)" : "var(--card)",
                color:
                  filterStatus === f.value
                    ? "var(--primary-foreground)"
                    : "var(--foreground)",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
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

        {/* Subject filter */}
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          style={{
            height: 36,
            padding: "0 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            backgroundColor: "var(--card)",
            fontSize: 13,
            color: "var(--foreground)",
            outline: "none",
            minWidth: 180,
          }}
        >
          <option value="">Barcha fanlar</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sessions list */}
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
      ) : filteredSessions?.length === 0 ? (
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 48,
            textAlign: "center",
          }}
        >
          <BarChart3
            style={{
              width: 32,
              height: 32,
              color: "var(--muted-foreground)",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ fontSize: 15, fontWeight: 500 }}>Sessiya topilmadi</p>
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
          {filteredSessions?.map((session, i) => {
            const pct = session.percentage
              ? parseFloat(session.percentage)
              : null;
            const isCompleted = session.finishedAt !== null;

            return (
              <div
                key={session.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 20px",
                  borderBottom:
                    i < (filteredSessions?.length ?? 0) - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                {/* Status icon */}
                {isCompleted ? (
                  <CheckCircle
                    style={{
                      width: 18,
                      height: 18,
                      color: "#10b981",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <XCircle
                    style={{
                      width: 18,
                      height: 18,
                      color: "var(--muted-foreground)",
                      flexShrink: 0,
                    }}
                  />
                )}

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
                      {session.student.fullName}
                    </p>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#3b82f6",
                        backgroundColor: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        padding: "1px 6px",
                        borderRadius: 999,
                      }}
                    >
                      {session.subject.name}
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
                      {session.student.phone}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        color: "var(--muted-foreground)",
                      }}
                    >
                      <BookOpen style={{ width: 11, height: 11 }} />
                      {session.score ?? 0}/{session.actualCount} ta to'g'ri
                    </span>
                    {session.durationSec && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        <Clock style={{ width: 11, height: 11 }} />
                        {formatDuration(session.durationSec)}
                      </span>
                    )}
                    <span
                      style={{ fontSize: 12, color: "var(--muted-foreground)" }}
                    >
                      {formatDate(session.startedAt)}
                    </span>
                  </div>
                </div>

                {/* Percentage */}
                {pct !== null ? (
                  <div
                    style={{
                      padding: "4px 12px",
                      borderRadius: 8,
                      backgroundColor:
                        pct >= 80
                          ? "#ecfdf5"
                          : pct >= 50
                            ? "#fffbeb"
                            : "#fef2f2",
                      border: `1px solid ${pct >= 80 ? "#a7f3d0" : pct >= 50 ? "#fde68a" : "#fecaca"}`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color:
                          pct >= 80
                            ? "#10b981"
                            : pct >= 50
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    >
                      {Math.round(pct)}%
                    </p>
                  </div>
                ) : (
                  <span
                    style={{ fontSize: 12, color: "var(--muted-foreground)" }}
                  >
                    Jarayonda
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
