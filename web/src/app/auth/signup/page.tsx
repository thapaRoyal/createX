"use client";

import { SignupForm } from "@/components/signup-form";
import { useSignup } from "@/hooks/use-signup";
import { Command } from "lucide-react";

const SignUp = () => {
  const { handleSignup, isLoading, isError, error } = useSignup();

  const handleSignupSubmit = (email: string, password: string) => {
    const payload: AuthPayload = { email, password };
    handleSignup(payload);
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
        <SignupForm
          onSubmit={handleSignupSubmit}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>
    </div>
  );
};

export default SignUp;
