"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserPlus, GraduationCap } from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Ism kamida 2 ta belgi bo'lishi kerak"),
    lastName: z.string().min(2, "Familiya kamida 2 ta belgi bo'lishi kerak"),
    email: z.string().email("Email noto'g'ri formatda"),
    password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar mos kelmayapti",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { mutate: register, isPending, error } = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, firstName, lastName, ...rest } = data;
    register({
      ...rest,
      fullName: `${firstName} ${lastName}`,
    });
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
            Edu Test Platform
          </h1>
          <p className="text-sm text-muted-foreground">
            Tizimga kirish uchun ma'lumotlarni kiriting
          </p>
        </div>

        {/* Form card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Ism va Familiya */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Ism
                </Label>
                <Input
                  id="firstName"
                  placeholder="Ali"
                  className="h-11 rounded-xl"
                  autoComplete="off"
                  {...formRegister("firstName")}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Familiya
                </Label>
                <Input
                  id="lastName"
                  placeholder="Valiyev"
                  className="h-11 rounded-xl"
                  autoComplete="off"
                  {...formRegister("lastName")}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

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
                {...formRegister("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Parol */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm font-medium">
                Parol
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl"
                autoComplete="new-password"
                {...formRegister("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Parolni tasdiqlash */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Parolni tasdiqlang
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl"
                autoComplete="new-password"
                {...formRegister("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
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
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ro'yxatdan o'tish
                </>
              )}
            </Button>

            {/* Login ga o'tish */}
            <p className="text-center text-sm text-muted-foreground">
              Hisobingiz bormi?{" "}
              <a
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Kirish
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
