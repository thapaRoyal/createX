// hooks/useLogin.ts
import { useAuth } from "@/providers/auth.context-provider";
import { AuthService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Define the hook
export const useLogin = () => {
  const { updateAccessToken } = useAuth();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      const { accessToken } = data;
      // Store tokens in context (in memory)
      updateAccessToken(accessToken); // Set the access token in context
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed!", error);
    },
  });

  const handleLogin = (payload: AuthPayload) => {
    mutation.mutate(payload);
  };

  return {
    handleLogin,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
