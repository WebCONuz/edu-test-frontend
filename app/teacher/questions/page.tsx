import { Suspense } from "react";
import { TeacherQuestionsPage } from "@/features/teacher/components/questions/TeacherQuestionsPage";

export default function QuestionsPage() {
  return (
    <Suspense>
      <TeacherQuestionsPage />
    </Suspense>
  );
}
