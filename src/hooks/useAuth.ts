import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/authService";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

export const useAuth = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return {
    user: data?.data as User | null,
    isLoading,
    error,
    refetch,
  };
};
