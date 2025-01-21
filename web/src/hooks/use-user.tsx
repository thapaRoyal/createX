import { UserService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export const useGetuser = (userId: string) => {
  const { data, error, isLoading } = useQuery<IUser, Error>({
    queryKey: ["user", userId],
    queryFn: async () => UserService.getUserDetails({ userId }),
    enabled: !!userId,
  });

  return { data, error, isLoading };
};
