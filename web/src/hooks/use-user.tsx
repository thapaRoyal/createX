import { UserService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export const useGetuser = () => {
  const { data, error, isLoading, refetch } = useQuery<IUser, Error>({
    queryKey: ["user"],
    queryFn: async () => UserService.getUserDetails(),
  });

  return { data, error, isLoading, refetch };
};
