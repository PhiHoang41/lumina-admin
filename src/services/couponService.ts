import api from "./api";

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  allowMultipleUsePerUser?: boolean;
  validFrom: string;
  validTo: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CouponFormData {
  code: string;
  description?: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  allowMultipleUsePerUser?: boolean;
  validFrom: string;
  validTo: string;
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
}

export interface CouponsResponse {
  success: boolean;
  message: string;
  data: {
    coupons: Coupon[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CouponResponse {
  success: boolean;
  message: string;
  data: Coupon;
}

const couponService = {
  getCoupons: async (params?: {
    page?: number;
    limit?: number;
    showDeleted?: boolean;
  }): Promise<CouponsResponse> => {
    const response = await api.get<CouponsResponse>("/coupons", { params });
    return response.data;
  },

  getCouponById: async (id: string): Promise<CouponResponse> => {
    const response = await api.get<CouponResponse>(`/coupons/${id}`);
    return response.data;
  },

  createCoupon: async (data: CouponFormData): Promise<CouponResponse> => {
    const response = await api.post<CouponResponse>("/coupons", data);
    return response.data;
  },

  updateCoupon: async (
    id: string,
    data: CouponFormData,
  ): Promise<CouponResponse> => {
    const response = await api.put<CouponResponse>(`/coupons/${id}`, data);
    return response.data;
  },

  deleteCoupon: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch<{ success: boolean; message: string }>(
      `/coupons/${id}/soft-delete`,
    );
    return response.data;
  },

  restoreCoupon: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch<{ success: boolean; message: string }>(
      `/coupons/${id}/restore`,
    );
    return response.data;
  },
};

export default couponService;
