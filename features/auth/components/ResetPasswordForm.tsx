"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Lock, GraduationCap } from "lucide-react";
import { useResetPassword } from "../hooks/useResetPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";

const schema = z
  .object({
    newPassword: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Parollar mos kelmayapti",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!token) return;
    resetPassword({ token, newPassword: data.newPassword });
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Token topilmadi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Yangi parol
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Yangi parolingizni kiriting
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Yangi parol
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl"
                autoComplete="new-password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-xs text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Parolni tasdiqlang
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
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
                "Parolni saqlash"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Edu Test Platform © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
