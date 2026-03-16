import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import type { SessionQuestion } from "../types/student.types";
import { fetcher } from "@/lib/fetcher";

interface TestSession {
  sessionId: string;
  questions: SessionQuestion[];
  startTime: number;
  duration: number;
}

interface SubmitDto {
  answers: {
    questionId: string;
    selectedOptionId: string | null;
  }[];
}

export function useStudentTest() {
  const router = useRouter();
  const [session, setSession] = useState<TestSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // localStorage dan session olish
  useEffect(() => {
    const raw = localStorage.getItem("test_session");
    if (!raw) {
      router.push("/student");
      return;
    }
    const data: TestSession = JSON.parse(raw);
    setSession(data);

    // Qancha vaqt qolganini hisoblash
    const elapsed = Date.now() - data.startTime;
    const remaining = data.duration - elapsed;
    if (remaining <= 0) {
      router.push("/student");
      return;
    }
    setTimeLeft(Math.floor(remaining / 1000));
  }, []);

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: (data: SubmitDto) =>
      fetcher(`/sessions/${session?.sessionId}/submit`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (response) => {
      localStorage.setItem("test_result", JSON.stringify(response));
      localStorage.removeItem("test_session");
      router.push("/student/result");
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });

  // Submit funksiyasi
  const submitTest = useCallback(() => {
    if (!session) return;
    const answersList = session.questions.map((q) => ({
      questionId: q.questionId,
      selectedOptionId: answers[q.questionId] ?? null,
    }));
    submitMutation.mutate({ answers: answersList });
  }, [session, answers]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, submitTest]);

  // Javob tanlash
  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Navigatsiya
  const goNext = () => {
    if (session && currentIndex < session.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  // Timer formatlash
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const currentQuestion = session?.questions[currentIndex];
  const totalQuestions = session?.questions.length ?? 0;
  const answeredCount = Object.keys(answers).length;

  return {
    session,
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
    isSubmitting: submitMutation.isPending,
  };
}
