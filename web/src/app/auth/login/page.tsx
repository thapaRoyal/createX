"use client";

import { LoginForm } from "@/components/login-form";
import { useLogin } from "@/hooks/use-login";
import { useGetuser } from "@/hooks/use-user";
import { useUser } from "@/providers/user.context-provider";
import { Command } from "lucide-react";
import { useEffect } from "react";

const Login = () => {
  const { handleLogin, isLoading, isError, error } = useLogin();
  const { updateUser }: any = useUser();

  const { data: userData, refetch } = useGetuser();

  useEffect(() => {
    if (userData) {
      updateUser(userData);
    }
  }, [userData, updateUser]);

  const handleLoginSubmit = async (email: string, password: string) => {
    const payload: AuthPayload = { email, password };
    try {
      await handleLogin(payload);
      refetch();
    } catch (error) {
      console.error(error);
    }
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
        <LoginForm
          onSubmit={handleLoginSubmit}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>
    </div>
  );
};

export default Login;
