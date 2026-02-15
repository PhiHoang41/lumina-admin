import api from "./api";
import { removeToken } from "../utils/token";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      _id: string;
      fullName: string;
      email: string;
      role: string;
    };
  };
}

export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

export const logout = () => {
  removeToken();
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};
