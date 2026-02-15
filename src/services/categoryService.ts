import api from "./api";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  image?: string;
  isActive?: boolean;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

const categoryService = {
  getCategories: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<CategoriesResponse> => {
    const response = await api.get<CategoriesResponse>("/categories", {
      params,
    });
    return response.data;
  },

  getCategoryById: async (id: string): Promise<CategoryResponse> => {
    const response = await api.get<CategoryResponse>(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: CategoryFormData): Promise<CategoryResponse> => {
    const response = await api.post<CategoryResponse>("/categories", data);
    return response.data;
  },

  updateCategory: async (
    id: string,
    data: CategoryFormData,
  ): Promise<CategoryResponse> => {
    const response = await api.put<CategoryResponse>(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/categories/${id}`,
    );
    return response.data;
  },
};

export default categoryService;
