"use client";

import { Clock, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useStudentTest } from "../hooks/useStudentTest";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MathText } from "@/shared/components/MathText";

export function StudentTestPage() {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    answeredCount,
    answers,
    timeLeft,
    formatTime,
    selectAnswer,
    goNext,
    goPrev,
    goTo,
    submitTest,
    isSubmitting,
  } = useStudentTest();

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isLowTime = timeLeft <= 60;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Savol raqami */}
          <span className="text-sm font-medium text-muted-foreground">
            {currentIndex + 1} / {totalQuestions}
          </span>

          {/* Timer */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono font-medium ${
              isLowTime
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>

          {/* Javob berilganlar */}
          <span className="text-sm font-medium text-muted-foreground">
            {answeredCount}/{totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-2">
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Savol */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="mb-6">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Savol {currentIndex + 1}
          </span>
          <p className="text-lg font-medium text-foreground mt-2 leading-relaxed">
            <MathText text={currentQuestion.questionText} />
          </p>
          {currentQuestion.imageUrl && (
            <img
              src={currentQuestion.imageUrl}
              alt="Savol rasmi"
              className="mt-4 rounded-xl max-w-full border border-border"
            />
          )}
        </div>

        {/* Javob variantlari */}
        <div className="space-y-3">
          {currentQuestion.answerOptions.map((option) => {
            const isSelected =
              answers[currentQuestion.questionId] === option.id;
            return (
              <button
                key={option.id}
                onClick={() =>
                  selectAnswer(currentQuestion.questionId, option.id)
                }
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-150 ${
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {option.optionLabel}
                  </span>
                  <span className="text-sm leading-relaxed">
                    {option.optionText}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Savol navigatsiyasi */}
        <div className="mt-8">
          <p className="text-xs text-muted-foreground mb-3">Savollar:</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const isAnswered = answers[Object.keys(answers)[i]] !== undefined;
              const isCurrent = i === currentIndex;

              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isAnswered
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-card border-t border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Oldingi
          </Button>

          {currentIndex === totalQuestions - 1 ? (
            <Button
              onClick={submitTest}
              disabled={isSubmitting}
              className="rounded-xl flex-1"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Testni yakunlash
                </>
              )}
            </Button>
          ) : (
            <Button onClick={goNext} className="rounded-xl flex-1">
              Keyingi
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
