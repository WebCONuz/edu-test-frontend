import { TeacherHeader } from "../../features/teacher/components/layout/TeacherHeader";
import { TeacherSidebar } from "../../features/teacher/components/layout/TeacherSidebar";

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
        backgroundColor: "var(--background)",
      }}
    >
      <TeacherSidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: 260,
        }}
      >
        <TeacherHeader />
        <main
          style={{ flex: 1, padding: "24px", backgroundColor: "var(--muted)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
