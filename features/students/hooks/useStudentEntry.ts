import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { studentsApi } from "../api/students.api";
import type { CheckPhoneResponse } from "../types/student.types";

export function useStudentEntry() {
  const router = useRouter();
  const [checkedStudent, setCheckedStudent] =
    useState<CheckPhoneResponse | null>(null);

  const checkPhoneMutation = useMutation({
    mutationFn: studentsApi.checkPhone,
    onSuccess: (response) => {
      setCheckedStudent(response);
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });

  const createAndStartMutation = useMutation({
    mutationFn: async (data: {
      fullName: string;
      phone: string;
      subjectId: string;
      questionCount: number;
      duration: number;
    }) => {
      const { fullName, phone, subjectId, questionCount, duration } = data;

      let studentId: string;

      if (checkedStudent?.exists && checkedStudent.student?.id) {
        studentId = checkedStudent.student.id;
      } else {
        const student = await studentsApi.createStudent({ fullName, phone });
        studentId = student.id;
      }

      return studentsApi.startSession({
        studentId,
        subjectId,
        requestedCount: questionCount, // ← o'zgardi
      });
    },
    onSuccess: (response, variables) => {
      localStorage.setItem(
        "test_session",
        JSON.stringify({
          sessionId: response.sessionId,
          questions: response.questions,
          startTime: Date.now(),
          duration: variables.duration * 60 * 1000, // faqat frontda
        }),
      );
      router.push("/student/test");
    },
  });

  return {
    checkedStudent,
    studentFullName: checkedStudent?.student?.fullName ?? "",
    checkPhone: checkPhoneMutation.mutate,
    isCheckingPhone: checkPhoneMutation.isPending,
    startSession: createAndStartMutation.mutate,
    isStarting: createAndStartMutation.isPending,
    checkPhoneError: checkPhoneMutation.error,
    startError: createAndStartMutation.error,
  };
}
