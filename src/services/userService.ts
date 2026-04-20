import api from "./api";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  role: "USER" | "ADMIN";
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: "USER" | "ADMIN";
  avatar?: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  showDeleted?: boolean;
}

const userService = {
  getUsers: async (params: GetUsersParams = {}): Promise<UsersResponse> => {
    const { page = 1, limit = 10, search, role, showDeleted } = params;

    const response = await api.get<UsersResponse>("/users", {
      params: {
        page,
        limit,
        ...(search && { search }),
        ...(role && { role }),
        ...(showDeleted && { showDeleted: "true" }),
      },
    });
    return response.data;
  },

  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch<{ success: boolean; message: string }>(`/users/${id}/soft-delete`);
    return response.data;
  },

  restoreUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch<{ success: boolean; message: string }>(`/users/${id}/restore`);
    return response.data;
  },

  changePassword: async (id: string, data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.put<{ success: boolean; message: string }>(`/users/${id}/password`, data);
    return response.data;
  },

  adminChangePassword: async (id: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put<{ success: boolean; message: string }>(`/users/${id}/admin-password`, { newPassword });
    return response.data;
  },

  changeRole: async (id: string, role: string): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/users/${id}/role`, { role });
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<UserResponse> => {
    const response = await api.post<UserResponse>("/users", data);
    return response.data;
  },
};

export default userService;
