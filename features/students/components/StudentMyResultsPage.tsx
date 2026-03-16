"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMyResults } from "../hooks/useMyResults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Phone,
  Loader2,
  BarChart3,
  BookOpen,
} from "lucide-react";

const schema = z.object({
  phone: z
    .string()
    .min(1, "Telefon raqam kiriting")
    .refine(
      (val) => /^\+998\d{9}$/.test(val.replace(/\s/g, "")),
      "Format: +998 XX XXX XX XX",
    ),
});

type FormValues = z.infer<typeof schema>;

export function StudentMyResultsPage() {
  const { mutate: getResults, isPending, data, error } = useMyResults();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: "" },
  });

  const onSubmit = (values: FormValues) => {
    getResults(values.phone.replace(/\s/g, ""));
  };

  // Umumiy statistika
  const totalTests = data?.testSessions.length ?? 0;
  const avgPercentage = totalTests
    ? Math.round(
        data!.testSessions.reduce(
          (sum, s) => sum + parseFloat(s.percentage),
          0,
        ) / totalTests,
      )
    : 0;
  const bestScore = totalTests
    ? Math.max(...data!.testSessions.map((s) => parseFloat(s.percentage)))
    : 0;
  const totalQuestions =
    data?.testSessions.reduce((sum, s) => sum + s.actualCount, 0) ?? 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("uz-UZ", {
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

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-amber-500";
    return "text-destructive";
  };

  const getPercentageBg = (percentage: number) => {
    if (percentage >= 80) return "bg-green-50 border-green-200";
    if (percentage >= 50) return "bg-amber-50 border-amber-200";
    return "bg-destructive/5 border-destructive/20";
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-xl mx-auto space-y-4">
        {/* Sarlavha */}
        <div className="flex flex-col items-center mb-2">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <BarChart3 className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Mening natijalarim
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Telefon raqamingizni kiriting
          </p>
        </div>

        {/* Telefon form */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Telefon raqam
              </Label>
              <Input
                id="phone"
                placeholder="+998 99 542 63 00"
                className="h-11 rounded-xl"
                autoComplete="off"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-xs text-destructive">{error.message}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 rounded-xl font-medium"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Natijalarni ko'rish"
              )}
            </Button>
          </form>
        </div>

        {/* Natijalar */}
        {data && (
          <>
            {/* Foydalanuvchi */}
            <div className="bg-card border border-border rounded-2xl px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">
                  {data.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{data.fullName}</p>
                <p className="text-sm text-muted-foreground">{data.phone}</p>
              </div>
            </div>

            {/* Umumiy statistika */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                <p className="text-xl font-semibold text-foreground">
                  {totalTests}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Jami testlar
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <BarChart3 className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-semibold text-foreground">
                  {avgPercentage}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  O'rtacha ball
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                <p className="text-xl font-semibold text-foreground">
                  {bestScore}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Eng yuqori ball
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <BookOpen className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <p className="text-xl font-semibold text-foreground">
                  {totalQuestions}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Jami savollar
                </p>
              </div>
            </div>

            {/* Test tarixi */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-medium text-foreground">Test tarixi</h2>
              </div>

              <div className="divide-y divide-border">
                {data.testSessions.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                    Hali test yechmagan
                  </div>
                ) : (
                  data.testSessions.map((session, i) => {
                    const pct = parseFloat(session.percentage);
                    return (
                      <div key={session.id} className="px-6 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-muted-foreground">
                                #{i + 1}
                              </span>
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                {session.subject.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                {session.score}/{session.actualCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDuration(session.durationSec)}
                              </span>
                              <span>{formatDate(session.startedAt)}</span>
                            </div>
                          </div>

                          {/* Foiz */}
                          <div
                            className={`px-3 py-1.5 rounded-xl border text-sm font-semibold ${getPercentageBg(pct)} ${getPercentageColor(pct)}`}
                          >
                            {Math.round(pct)}%
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct >= 80
                                ? "bg-green-500"
                                : pct >= 50
                                  ? "bg-amber-500"
                                  : "bg-destructive"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Qaytish */}
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl"
              onClick={() => (window.location.href = "/student")}
            >
              Testga qaytish
            </Button>
          </>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Edu Test Platform © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
