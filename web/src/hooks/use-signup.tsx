import { useAuth } from "@/providers/auth.context-provider";
import { AuthService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Define the hook
export const useSignup = () => {
  const { updateAccessToken } = useAuth();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: AuthService.register,
    onSuccess: (data) => {
      const { accessToken } = data;
      // Store tokens in context (in memory)
      updateAccessToken(accessToken); // Set the access token in context
      router.push("/dashboard");
    },
  });

  const handleSignup = (payload: AuthPayload) => {
    mutation.mutate(payload);
  };

  return {
    handleSignup,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
