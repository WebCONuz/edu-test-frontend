"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  RotateCcw,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TestResult } from "../types/student.types";
import { MathText } from "../../../shared/components/MathText";

export function StudentResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("test_result");
    if (!raw) {
      router.push("/student");
      return;
    }
    setResult(JSON.parse(raw));
  }, []);

  if (!result) return null;

  const percentage = Math.round(result.percentage);
  const minutes = Math.floor(result.durationSec / 60);
  const seconds = result.durationSec % 60;

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-amber-500";
    return "text-destructive";
  };

  const getScoreBg = () => {
    if (percentage >= 80) return "bg-green-50 border-green-200";
    if (percentage >= 50) return "bg-amber-50 border-amber-200";
    return "bg-destructive/5 border-destructive/20";
  };

  const getScoreLabel = () => {
    if (percentage >= 80) return "A'lo natija!";
    if (percentage >= 50) return "Yaxshi harakat!";
    return "Ko'proq mashq kerak!";
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Asosiy natija */}
        <div className={`rounded-2xl border p-8 text-center ${getScoreBg()}`}>
          <Trophy className={`w-12 h-12 mx-auto mb-4 ${getScoreColor()}`} />

          <h1 className="text-2xl font-semibold text-foreground mb-1">
            {getScoreLabel()}
          </h1>

          <p className="text-sm text-muted-foreground mb-6">Test yakunlandi</p>

          {/* Foiz */}
          <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
            {percentage}%
          </div>

          <p className="text-sm text-muted-foreground">
            {result.score} ta to'g'ri / {result.totalQuestions} ta savol
          </p>
        </div>

        {/* Statistika */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <p className="text-xl font-semibold text-foreground">
              {result.score}
            </p>
            <p className="text-xs text-muted-foreground mt-1">To'g'ri</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <XCircle className="w-5 h-5 text-destructive mx-auto mb-2" />
            <p className="text-xl font-semibold text-foreground">
              {result.totalQuestions - result.score}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Noto'g'ri</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xl font-semibold text-foreground">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Vaqt</p>
          </div>
        </div>

        {/* Savollar tahlili */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-6 py-4 flex items-center justify-between text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            <span>Savollar tahlili</span>
            <span className="text-muted-foreground">
              {showDetails ? "▲" : "▼"}
            </span>
          </button>

          {showDetails && (
            <div className="divide-y divide-border">
              {result.questions.map((q, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {q.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed mb-2">
                        {q.order}. <MathText text={q.questionText} />
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Sizning javobingiz:{" "}
                          <span
                            className={
                              q.isCorrect
                                ? "text-green-600 font-medium"
                                : "text-destructive font-medium"
                            }
                          >
                            {q.selectedOption}
                          </span>
                        </p>
                        {!q.isCorrect && (
                          <p className="text-xs text-muted-foreground">
                            To'g'ri javob:{" "}
                            <span className="text-green-600 font-medium">
                              {q.correctOption}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tugmalar */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="rounded-xl h-11"
            onClick={() => {
              localStorage.removeItem("test_result");
              router.push("/student");
            }}
          >
            <Home className="w-4 h-4 mr-2" />
            Bosh sahifa
          </Button>

          <Button
            className="rounded-xl h-11"
            onClick={() => {
              localStorage.removeItem("test_result");
              router.push("/student");
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Qayta urinish
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Edu Test Platform © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
