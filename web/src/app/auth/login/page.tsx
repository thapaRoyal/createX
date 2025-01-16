"use client";

import { LoginForm } from "@/components/login-form";
import { AuthService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { Command } from "lucide-react";
import { redirect } from "next/navigation";

const Login = () => {
  const mutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      console.warn("successfull login", data);
      redirect("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed!", error);
    },
  });

  const handleLogin = (email: string, password: string) => {
    const payload: AuthPayload = { email, password };
    mutation.mutate(payload);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Command className="size-4" />
          </div>
          create X
        </a>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
