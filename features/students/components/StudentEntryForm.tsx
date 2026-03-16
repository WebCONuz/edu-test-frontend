"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Phone,
  User,
  BookOpen,
  Hash,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useStudentEntry } from "../hooks/useStudentEntry";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  phone: z
    .string()
    .min(1, "Telefon raqam kiriting")
    .refine(
      (val) => /^\+998\d{9}$/.test(val.replace(/\s/g, "")),
      "Format: +998 XX XXX XX XX",
    ),
  fullName: z.string().min(2, "Ism-familiya kamida 2 ta belgi"),
  subjectId: z.string().min(1, "Fan tanlang"),
  questionCount: z.coerce
    .number()
    .min(1, "Kamida 1 ta savol")
    .max(100, "Ko'pi bilan 100 ta savol"),
  duration: z.coerce
    .number()
    .min(1, "Kamida 1 daqiqa")
    .max(180, "Ko'pi bilan 180 daqiqa"),
});

type FormValues = z.infer<typeof schema>;

export function StudentEntryForm() {
  const {
    checkedStudent,
    studentFullName,
    checkPhone,
    isCheckingPhone,
    startSession,
    isStarting,
    startError,
  } = useStudentEntry();

  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      fullName: "",
      subjectId: "",
      questionCount: 20,
      duration: 20,
    },
  });

  const phone = watch("phone");

  // Telefon 9+ raqam bo'lganda avtomatik check-phone
  useEffect(() => {
    const cleaned = phone.replace(/\s/g, "");
    if (/^\+998\d{9}$/.test(cleaned)) {
      checkPhone({ phone: cleaned });
    }
  }, [phone]);

  // Mavjud student bo'lsa fullName avtomatik to'ldiriladi
  useEffect(() => {
    if (studentFullName) {
      setValue("fullName", studentFullName);
    }
  }, [studentFullName]);

  const onSubmit = (data: FormValues) => {
    startSession({
      fullName: data.fullName,
      phone: data.phone.replace(/\s/g, ""), // + saqlanadi
      subjectId: data.subjectId,
      questionCount: data.questionCount,
      duration: data.duration,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo va sarlavha */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-2">
            <BookOpen className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Testni boshlash
          </h1>
          <p className="text-sm text-muted-foreground">
            Ma'lumotlaringizni kiriting
          </p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Telefon */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Telefon raqam
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  placeholder="+998 99 542 63 00"
                  className="h-11 rounded-xl pr-10"
                  autoComplete="off"
                  {...register("phone")}
                />
                {isCheckingPhone && (
                  <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3.5 text-muted-foreground" />
                )}
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
              {checkedStudent?.exists && (
                <p className="text-xs text-green-600">
                  ✓ Siz avval ham test yechgansiz
                </p>
              )}
            </div>

            {/* Ism-familiya */}
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Ism-familiya
              </Label>
              <Input
                id="fullName"
                placeholder="Ali Valiyev"
                className="h-11 rounded-xl"
                autoComplete="off"
                readOnly={checkedStudent?.exists}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Fan */}
            <div className="space-y-2">
              <Label
                htmlFor="subjectId"
                className="text-sm font-medium flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Fan
              </Label>
              <select
                id="subjectId"
                className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("subjectId")}
              >
                <option value="">Fan tanlang</option>
                {isLoadingSubjects ? (
                  <option disabled>Yuklanmoqda...</option>
                ) : (
                  subjectsData
                    ?.filter((s) => s.isActive)
                    .map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))
                )}
              </select>
              {errors.subjectId && (
                <p className="text-xs text-destructive">
                  {errors.subjectId.message}
                </p>
              )}
            </div>

            {/* Savol soni va Vaqt */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="questionCount"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Hash className="w-4 h-4" />
                  Savol soni
                </Label>
                <Input
                  id="questionCount"
                  type="number"
                  min={1}
                  max={100}
                  className="h-11 rounded-xl"
                  {...register("questionCount")}
                />
                {errors.questionCount && (
                  <p className="text-xs text-destructive">
                    {errors.questionCount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="duration"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Vaqt
                </Label>
                <div className="relative">
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    max={180}
                    className="h-11 rounded-xl pr-16"
                    {...register("duration")}
                  />
                  <span className="absolute right-3 top-3 text-sm text-muted-foreground">
                    daqiqa
                  </span>
                </div>
                {errors.duration && (
                  <p className="text-xs text-destructive">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            {/* Server error */}
            {startError && (
              <div className="w-full px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-xs text-destructive">{startError.message}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isStarting}
              className="w-full h-11 rounded-xl font-medium"
            >
              {isStarting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Testni boshlash
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Edu Test Platform © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
