import { UserService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const useGetuser = () => {
  const token = Cookies.get("access_token");
  console.log("token", token);

  const { data, error, isLoading, refetch } = useQuery<IUser, Error>({
    queryKey: ["user"],
    queryFn: async () => UserService.getUserDetails(),
    enabled: !!token,
  });

  return { data, error, isLoading, refetch };
};
