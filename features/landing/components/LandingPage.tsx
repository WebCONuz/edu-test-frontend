"use client";

import Link from "next/link";
import {
  BookOpen,
  BarChart3,
  UserPlus,
  CheckCircle,
  Clock,
  Users,
  Trophy,
  ArrowRight,
  GraduationCap,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "Tez va qulay",
    description:
      "Telefon raqamingiz bilan darhol test yechishni boshlang. Ro'yxatdan o'tish shart emas.",
  },
  {
    icon: BarChart3,
    title: "Batafsil statistika",
    description:
      "Har bir test natijasi, to'g'ri va noto'g'ri javoblar, sarflangan vaqt — hammasi saqlanadi.",
  },
  {
    icon: Shield,
    title: "Xavfsiz tizim",
    description:
      "Ma'lumotlaringiz xavfsiz saqlanadi. Faqat siz o'z natijalaringizni ko'ra olasiz.",
  },
  {
    icon: Clock,
    title: "Vaqt nazorati",
    description:
      "O'zingiz belgilagan vaqt ichida test yeching. Vaqt tugasa natija avtomatik saqlanadi.",
  },
  {
    icon: BookOpen,
    title: "Ko'p fanlar",
    description:
      "Matematika, ingliz tili, dasturlash va boshqa ko'plab fanlar bo'yicha testlar mavjud.",
  },
  {
    icon: Trophy,
    title: "Natijalar tarixi",
    description:
      "Barcha yechgan testlaringiz tarixi saqlanadi. O'sishingizni kuzating.",
  },
];

const stats = [
  { value: "10,000+", label: "Yechilgan testlar" },
  { value: "500+", label: "Savollar bazasi" },
  { value: "1,000+", label: "Faol studentlar" },
  { value: "98%", label: "Mamnunlik darajasi" },
];

export function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--background)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GraduationCap
                style={{
                  width: 16,
                  height: 16,
                  color: "var(--primary-foreground)",
                }}
              />
            </div>
            <span style={{ fontWeight: 600, fontSize: 16 }}>Edu Test</span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Link href="/student">
              <Button variant="ghost" size="sm">
                <BookOpen style={{ width: 16, height: 16, marginRight: 6 }} />
                Test yechish
              </Button>
            </Link>
            <Link href="/student/my-results">
              <Button variant="ghost" size="sm">
                <BarChart3 style={{ width: 16, height: 16, marginRight: 6 }} />
                Natijalarimni ko'rish
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" style={{ marginLeft: 8 }}>
                <UserPlus style={{ width: 16, height: 16, marginRight: 6 }} />
                Teacher bo'lish
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "96px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor:
              "color-mix(in srgb, var(--primary) 10%, transparent)",
            color: "var(--primary)",
            padding: "6px 16px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          <Zap style={{ width: 14, height: 14 }} />
          Onlayn test platformasi
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.75rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            marginBottom: 24,
            color: "var(--foreground)",
          }}
        >
          Bilimingizni{" "}
          <span style={{ color: "var(--primary)" }}>sinab ko'ring</span>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "var(--muted-foreground)",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Ro'yxatdan o'tmasdan, telefon raqamingiz bilan darhol test yeching.
          Natijalaringizni kuzating va bilimingizni oshiring.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Link href="/student">
            <Button
              size="lg"
              style={{
                height: 48,
                padding: "0 32px",
                fontSize: 15,
                borderRadius: 12,
              }}
            >
              Testni boshlash
              <ArrowRight style={{ width: 18, height: 18, marginLeft: 8 }} />
            </Button>
          </Link>
          <Link href="/student/my-results">
            <Button
              size="lg"
              variant="outline"
              style={{
                height: 48,
                padding: "0 32px",
                fontSize: 15,
                borderRadius: 12,
              }}
            >
              <BarChart3 style={{ width: 18, height: 18, marginRight: 8 }} />
              Natijalarimni ko'rish
            </Button>
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: CheckCircle, text: "Bepul foydalanish" },
            { icon: Clock, text: "Vaqtni o'zingiz belgilang" },
            { icon: Users, text: "Ro'yxatdan o'tish shart emas" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "var(--muted-foreground)",
              }}
            >
              <item.icon
                style={{ width: 16, height: 16, color: "var(--primary)" }}
              />
              {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--muted)",
          padding: "56px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Nima uchun Edu Test?
          </h2>
          <p
            style={{
              color: "var(--muted-foreground)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Oddiy, tez va qulay test platformasi. Hech qanday to'siq yo'q —
            faqat bilim va natija.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 24,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor:
                    "color-mix(in srgb, var(--primary) 10%, transparent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <feature.icon
                  style={{ width: 20, height: 20, color: "var(--primary)" }}
                />
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--muted-foreground)",
                  lineHeight: 1.65,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--muted)",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Bugun boshlang
          </h2>
          <p
            style={{
              color: "var(--muted-foreground)",
              marginBottom: 32,
              lineHeight: 1.7,
            }}
          >
            Minglab studentlar allaqachon Edu Test dan foydalanmoqda. Siz ham
            qo'shiling!
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link href="/student">
              <Button
                size="lg"
                style={{ height: 48, padding: "0 32px", borderRadius: 12 }}
              >
                Test yechishni boshlash
                <ArrowRight style={{ width: 18, height: 18, marginLeft: 8 }} />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                style={{ height: 48, padding: "0 32px", borderRadius: 12 }}
              >
                <UserPlus style={{ width: 18, height: 18, marginRight: 8 }} />
                Teacher sifatida qo'shilish
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{ borderTop: "1px solid var(--border)", padding: "32px 24px" }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GraduationCap
                style={{
                  width: 14,
                  height: 14,
                  color: "var(--primary-foreground)",
                }}
              />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Edu Test</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {[
              { href: "/student", label: "Test yechish" },
              {
                href: "/student/my-results",
                label: "Natijalarimni tekshirish",
              },
              { href: "/register", label: "Teacher bo'lish" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 14,
                  color: "var(--muted-foreground)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
            © {new Date().getFullYear()} Edu Test Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
