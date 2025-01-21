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
      const { accessToken, user } = data;
      updateAccessToken(accessToken); // Set the access token in context
      router.push("/dashboard");
    },
  });

  const handleLogin = async (payload: AuthPayload) => {
    try {
      const result = await mutation.mutateAsync(payload); // Wait for the mutation to resolve
      return result; // Return the result of the login mutation
    } catch (error) {
      throw error; // Throw the error to be handled by the caller
    }
  };

  return {
    handleLogin,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};
