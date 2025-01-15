"use client";

import { LoginForm } from "@/components/login-form";
import { AppDispatch, RootState } from "@/lib/store";
import { loginUser } from "@/store/auth.store";
import { Command } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);

  const handleLogin = (email: string, password: string) => {
    dispatch(loginUser({ email, password }));
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
