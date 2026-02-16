import api from "./api";

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category: Category | string;
  basePrice: number;
  images: string[];
  variants: string[];
  isActive: boolean;
  totalStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  images?: string[];
  variants?: any[];
  isActive?: boolean;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ToggleStatusResponse {
  success: boolean;
  message: string;
  data: Product;
}

const productService = {
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>("/products", {
      params,
    });
    return response.data;
  },

  getProductById: async (id: string): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: ProductFormData): Promise<ProductResponse> => {
    const response = await api.post<ProductResponse>("/products", data);
    return response.data;
  },

  updateProduct: async (
    id: string,
    data: Partial<ProductFormData>,
  ): Promise<ProductResponse> => {
    const response = await api.put<ProductResponse>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/products/${id}`,
    );
    return response.data;
  },

  toggleProductStatus: async (id: string): Promise<ToggleStatusResponse> => {
    const response = await api.patch<ToggleStatusResponse>(
      `/products/${id}/activate`,
    );
    return response.data;
  },
};

export default productService;
