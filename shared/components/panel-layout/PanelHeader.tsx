"use client";

import { usePathname } from "next/navigation";
import type { PanelConfig } from "./types";

interface PanelHeaderProps {
  pageTitles: PanelConfig["pageTitles"];
}

export function PanelHeader({ pageTitles }: PanelHeaderProps) {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: "", description: "" };

  return (
    <header
      style={{
        height: 60,
        backgroundColor: "var(--card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
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
