import api from "./api";

export interface OrderItem {
  product: string;
  productName: string;
  variant: string;
  variantName: string;
  quantity: number;
  price: number;
}

export interface Coupon {
  _id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  description?: string;
}

export interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  note: string | null;
  orderBy: string;
  products: OrderItem[];
  coupon: Coupon | null;
  discountAmount: number;
  subtotal: number;
  totalPrice: number;
  paymentMethod: "COD" | "VNPAY";
  paymentStatus: "UNPAID" | "PAID";
  status: "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  vnpTransactionId: string | null;
  vnpTxnRef: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

export interface UpdateOrderStatusRequest {
  status: "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED";
}

const orderService = {
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
    sort?: string;
  }): Promise<OrdersResponse> => {
    const response = await api.get<OrdersResponse>("/orders", {
      params,
    });
    return response.data;
  },

  getOrderById: async (id: string): Promise<OrderResponse> => {
    const response = await api.get<OrderResponse>(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (
    id: string,
    data: UpdateOrderStatusRequest,
  ): Promise<OrderResponse> => {
    const response = await api.put<OrderResponse>(
      `/orders/${id}/admin-status`,
      data,
    );
    return response.data;
  },
};

export default orderService;
