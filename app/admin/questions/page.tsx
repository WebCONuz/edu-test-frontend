import { Suspense } from "react";
import { AdminQuestionsPage } from "@/features/admin/components/questions/AdminQuestionsPage";

export default function QuestionsPage() {
  return (
    <Suspense>
      <AdminQuestionsPage />
    </Suspense>
  );
}
