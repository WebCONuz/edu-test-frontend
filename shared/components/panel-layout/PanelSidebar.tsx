"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, GraduationCap } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { fetcher } from "@/lib/fetcher";
import type { NavItem } from "./types";

interface PanelSidebarProps {
  title: string;
  navItems: NavItem[];
}

export function PanelSidebar({ title, navItems }: PanelSidebarProps) {
  const pathname = usePathname();
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetcher("/auth/logout", { method: "POST" });
    } finally {
      clearUser();
      router.push("/");
    }
  };

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: 260,
        backgroundColor: "var(--card)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "12.5px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            backgroundColor: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <GraduationCap
            style={{
              width: 18,
              height: 18,
              color: "var(--primary-foreground)",
            }}
          />
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.2 }}>
            EDU TEST
          </p>
          <p
            style={{
              fontSize: 11,
              color: "var(--muted-foreground)",
              lineHeight: 1.2,
            }}
          >
            {title}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                backgroundColor: isActive
                  ? "color-mix(in srgb, var(--primary) 8%, transparent)"
                  : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              <item.icon
                style={{
                  width: 18,
                  height: 18,
                  flexShrink: 0,
                  color: isActive
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                }}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 8px 10px 8px",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
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
              {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
              {user?.fullName?.charAt(1).toUpperCase() ?? "U"}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textTransform: "capitalize",
              }}
            >
              {user?.fullName ?? "User"}
            </p>
            <p
              style={{
                fontSize: 10,
                color: "var(--muted-foreground)",
                lineHeight: 1.3,
                textTransform: "uppercase",
              }}
            >
              {user?.role?.replace("_", " ")}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 14,
            color: "var(--destructive)",
            backgroundColor:
              "color-mix(in srgb, var(--destructive) 8%, transparent)",
            border: "none",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--destructive)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              "color-mix(in srgb, var(--destructive) 8%, transparent)";
            e.currentTarget.style.color = "var(--destructive)";
          }}
        >
          <LogOut style={{ width: 18, height: 18, flexShrink: 0 }} />
          Chiqish
        </button>
      </div>
    </aside>
  );
}
