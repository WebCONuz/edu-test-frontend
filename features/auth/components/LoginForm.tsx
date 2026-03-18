"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, LogIn, GraduationCap } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Email noto'g'ri formatda"),
  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "solihsalimov@gmail.com",
      password: "123456789",
    },
  });
  //   SUPER ADMIN --------------------------------
  //   {
  //     "email": "superadmin@gmail.com",
  //     "password": "superadmin123"
  //   }

  //   ADMIN --------------------------------------
  //   {
  //     "email": "solihsalimov@gmail.com",
  //     "password": "123456789"
  //   }

  //   TEACHER ------------------------------------
  //   {
  //     "email": "muxammaditoshtemirov@gmail.com",
  //     "password": "123456"
  //   }

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo va sarlavha */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-3">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Edu Test Paltform
          </h1>
          <p className="text-sm text-muted-foreground">
            Tizimga kirish uchun ma'lumotlarni kiriting
          </p>
        </div>

        {/* Form card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm font-medium">
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

            {/* Parol */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Parol
                </Label>
                <a
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Parolni unutdingizmi?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl"
                autoComplete="off"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Server error */}
            {error && (
              <div className="w-full px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20">
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
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Kirish
                </>
              )}
            </Button>

            {/* Login ga o'tish */}
            <p className="text-center text-sm text-muted-foreground">
              Hisobingiz yo'qmi?{" "}
              <a
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Ro'yxatdan o'tish
              </a>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Edu Test Platform © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
