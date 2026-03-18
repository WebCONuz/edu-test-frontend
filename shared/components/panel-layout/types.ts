import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

export interface PanelConfig {
  role: "teacher" | "admin" | "super_admin";
  title: string;
  navItems: NavItem[];
  pageTitles: Record<string, { title: string; description: string }>;
}
