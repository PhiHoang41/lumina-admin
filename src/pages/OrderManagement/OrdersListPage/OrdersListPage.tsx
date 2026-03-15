import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Tag, message, Dropdown, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { Link } from "react-router-dom";
import PageTitle from "../../../components/PageTitle/PageTitle";
import orderService, { type Order } from "../../../services/orderService";

const OrdersListPage = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", pagination.current, pagination.pageSize],
    queryFn: () =>
      orderService.getOrders({
        page: pagination.current,
        limit: pagination.pageSize,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Order["status"];
    }) => orderService.updateOrderStatus(id, { status }),
    onSuccess: () => {
      message.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái",
      );
    },
  });

  const orders = data?.data || [];
  const total = data?.pagination.total || 0;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "orange",
      CONFIRMED: "blue",
      SHIPPING: "cyan",
      DELIVERED: "green",
      CANCELLED: "red",
    };
    return colors[status] || "default";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      UNPAID: "red",
      PAID: "green",
    };
    return colors[status] || "default";
  };

  const getStatusMenuItems = (record: Order): MenuProps["items"] => {
    const statuses: Order["status"][] = [
      "PENDING",
      "CONFIRMED",
      "SHIPPING",
      "DELIVERED",
      "CANCELLED",
    ];

    return statuses.map((status) => ({
      key: status,
      label:
        status === "PENDING"
          ? "Chờ xác nhận"
          : status === "CONFIRMED"
            ? "Đã xác nhận"
            : status === "SHIPPING"
              ? "Đang giao"
              : status === "DELIVERED"
                ? "Đã giao"
                : "Đã hủy",
      onClick: () => {
        if (record.status !== status) {
          updateStatusMutation.mutate({ id: record._id, status });
        }
      },
    }));
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.customerName}</div>
          <div className="text-xs text-gray-500">{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      key: "products",
      width: 250,
      render: (_, record) => {
        const productNames = record.products
          .slice(0, 2)
          .map((p) => p.productName)
          .join(", ");
        const moreText =
          record.products.length > 2
            ? ` +${record.products.length - 2} sản phẩm`
            : "";
        return <span className="text-sm">{productNames}{moreText}</span>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 130,
      align: "right",
      render: (totalPrice: number) => (
        <span className="font-semibold text-green-600">
          {totalPrice.toLocaleString("vi-VN")} đ
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: Order["status"], record: Order) => (
        <Dropdown
          menu={{ items: getStatusMenuItems(record) }}
          trigger={["click"]}
          disabled={updateStatusMutation.isPending}
        >
          <Tag
            color={getStatusColor(status)}
            className="cursor-pointer hover:opacity-80"
          >
            {status === "PENDING"
              ? "Chờ xác nhận"
              : status === "CONFIRMED"
                ? "Đã xác nhận"
                : status === "SHIPPING"
                  ? "Đang giao"
                  : status === "DELIVERED"
                    ? "Đã giao"
                    : "Đã hủy"}
          </Tag>
        </Dropdown>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 100,
      render: (paymentStatus: Order["paymentStatus"]) => (
        <Tag color={getPaymentStatusColor(paymentStatus)}>
          {paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
        </Tag>
      ),
    },
    {
      title: "Phương thức",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 100,
      render: (paymentMethod: Order["paymentMethod"]) => (
        <span>{paymentMethod === "COD" ? "COD" : "VNPay"}</span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (createdAt: string) => (
        <span className="text-sm">
          {new Date(createdAt).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Link to={`/orders/${record._id}`}>
          <Button type="link">Chi tiết</Button>
        </Link>
      ),
    },
  ];

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize });
  };

  return (
    <div>
      <PageTitle title="Quản lý đơn hàng" />
      <Card>
        {error ? (
          <div className="text-center py-10">
            <p className="text-red-500">
              Có lỗi xảy ra khi tải danh sách đơn hàng
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng ${total} đơn hàng`,
              onChange: handleTableChange,
              hideOnSinglePage: true,
            }}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
    </div>
  );
};

export default OrdersListPage;
