import { useQuery } from "@tanstack/react-query";

export const userUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {},
    enabled: !!userId,
  });
};
