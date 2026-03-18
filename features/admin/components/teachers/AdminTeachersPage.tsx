"use client";

import { useState } from "react";
import { useUsers } from "../../hooks/admin.hooks";
import { Input } from "@/components/ui/input";
import { Users, Loader2 } from "lucide-react";

export function AdminTeachersPage() {
  const { data: users, isLoading } = useUsers();
  const [search, setSearch] = useState("");

  const teachers = users
    ?.filter((u) => u.role === "teacher")
    .filter((u) => {
      if (!search.trim()) return true;
      return (
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    });

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
            Barcha o'qituvchilar ro'yxati
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
            Jami {teachers?.length ?? 0} ta teacher
          </p>
        </div>
        <Input
          placeholder="Ism yoki email qidirish..."
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
      </div>

      {/* List */}
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
      ) : teachers?.length === 0 ? (
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 48,
            textAlign: "center",
          }}
        >
          <Users
            style={{
              width: 32,
              height: 32,
              color: "var(--muted-foreground)",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ fontSize: 15, fontWeight: 500 }}>Teacher topilmadi</p>
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
          {teachers?.map((u, i) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 20px",
                borderBottom:
                  i < (teachers?.length ?? 0) - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor:
                    "color-mix(in srgb, var(--primary) 15%, transparent)",
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
                    color: "var(--primary)",
                  }}
                >
                  {u.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 3,
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{u.fullName}</p>
                  <span
                    style={{
                      fontSize: 10,
                      color: u.isActive ? "#10b981" : "#ef4444",
                      backgroundColor: u.isActive ? "#ecfdf5" : "#fef2f2",
                      border: `1px solid ${u.isActive ? "#a7f3d0" : "#fecaca"}`,
                      padding: "1px 6px",
                      borderRadius: 999,
                    }}
                  >
                    {u.isActive ? "Faol" : "Nofaol"}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                  {u.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
