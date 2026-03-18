"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { PanelSidebar } from "@/shared/components/panel-layout/PanelSidebar";
import { PanelHeader } from "@/shared/components/panel-layout/PanelHeader";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Users,
  GraduationCap,
  BarChart3,
} from "lucide-react";

const baseNavItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/subjects", icon: BookOpen, label: "Fanlar" },
  { href: "/admin/questions", icon: HelpCircle, label: "Savollar" },
  { href: "/admin/students", icon: GraduationCap, label: "Studentlar" },
  { href: "/admin/sessions", icon: BarChart3, label: "Sessiyalar" },
];

const superAdminNavItems = [
  ...baseNavItems,
  { href: "/admin/users", icon: Users, label: "Foydalanuvchilar" },
];

const adminNavItems = [
  ...baseNavItems,
  { href: "/admin/teachers", icon: Users, label: "Teacherlar" },
];

const pageTitles = {
  "/admin/dashboard": { title: "Dashboard", description: "Umumiy statistika" },
  "/admin/subjects": {
    title: "Fanlar",
    description: "Barcha fanlar boshqaruvi",
  },
  "/admin/questions": {
    title: "Savollar",
    description: "Barcha savollar boshqaruvi",
  },
  "/admin/students": {
    title: "Studentlar",
    description: "Studentlar ro'yxati va boshqaruv",
  },
  "/admin/sessions": {
    title: "Sessiyalar",
    description: "Test sessiyalari statistikasi",
  },
  "/admin/users": {
    title: "Foydalanuvchilar",
    description: "Admin va teacherlar boshqaruvi",
  },
  "/admin/teachers": {
    title: "Teacherlar",
    description: "Teacherlar ro'yxati",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === "super_admin";
  const navItems = isSuperAdmin ? superAdminNavItems : adminNavItems;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--muted)",
      }}
    >
      <PanelSidebar title="Admin Panel" navItems={navItems} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginLeft: 260,
        }}
      >
        <PanelHeader pageTitles={pageTitles} />
        <main style={{ flex: 1, padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}
