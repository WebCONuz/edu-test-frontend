"use client";

import { PanelSidebar } from "@/shared/components/panel-layout/PanelSidebar";
import { PanelHeader } from "@/shared/components/panel-layout/PanelHeader";
import { LayoutDashboard, BookOpen, HelpCircle } from "lucide-react";

const navItems = [
  { href: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/teacher/subjects", icon: BookOpen, label: "Fanlar" },
  { href: "/teacher/questions", icon: HelpCircle, label: "Savollar" },
];

const pageTitles = {
  "/teacher/dashboard": {
    title: "Dashboard",
    description: "Umumiy statistika va so'nggi faoliyat",
  },
  "/teacher/subjects": {
    title: "Fanlar",
    description: "Fanlar ro'yxati va boshqaruv",
  },
  "/teacher/questions": {
    title: "Savollar",
    description: "Savollar ro'yxati va boshqaruv",
  },
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--muted)",
      }}
    >
      <PanelSidebar title="Teacher Panel" navItems={navItems} />
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
