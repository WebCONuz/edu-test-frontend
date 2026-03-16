"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Mail,
  ArrowLeft,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Email noto'g'ri formatda"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const {
    mutate: forgotPassword,
    isPending,
    isSuccess,
    error,
  } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: FormValues) => {
    forgotPassword(data);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Parolni tiklash
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Emailingizga parol tiklash havolasi yuboramiz
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {isSuccess ? (
            // Success holat
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="font-semibold text-foreground mb-2">
                Email yuborildi!
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Parolni tiklash havolasi emailingizga yuborildi. Spam papkasini
                ham tekshiring.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full h-11 rounded-xl">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Loginga qaytish
                </Button>
              </Link>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="h-11 rounded-xl"
                  autoComplete="off"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
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
                  "Havolani yuborish"
                )}
              </Button>

              <Link href="/login">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-11 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Loginga qaytish
                </Button>
              </Link>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Edu Test Platform © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
