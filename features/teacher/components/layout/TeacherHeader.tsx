"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; description: string }> = {
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

export function TeacherHeader() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: "", description: "" };

  return (
    <header
      style={{
        height: 64,
        backgroundColor: "var(--card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div>
        <h1 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>
          {page.title}
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "var(--muted-foreground)",
            lineHeight: 1.2,
          }}
        >
          {page.description}
        </p>
      </div>
    </header>
  );
}
