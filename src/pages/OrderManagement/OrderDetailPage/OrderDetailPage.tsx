import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Row,
  Col,
  Descriptions,
  Table,
  Tag,
  Button,
  message,
  Spin,
  Divider,
  Modal,
} from "antd";
import { ArrowLeftOutlined, UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, FileTextOutlined, CheckCircleOutlined, CarOutlined, CloseCircleOutlined } from "@ant-design/icons";
import PageTitle from "../../../components/PageTitle/PageTitle";
import orderService, { type Order } from "../../../services/orderService";
import { formatPrice, formatDate } from "../../../utils/format";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrderById(id!),
    enabled: !!id,
  });

  const confirmOrderMutation = useMutation({
    mutationFn: () => orderService.updateOrderStatus(id!, { status: "CONFIRMED" }),
    onSuccess: () => {
      message.success("Xác nhận đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xác nhận đơn hàng");
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: () => orderService.updateOrderStatus(id!, { status: "CANCELLED" }),
    onSuccess: () => {
      message.success("Hủy đơn hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi hủy đơn hàng");
    },
  });

  const shipOrderMutation = useMutation({
    mutationFn: () => orderService.updateOrderStatus(id!, { status: "SHIPPING" }),
    onSuccess: () => {
      message.success("Cập nhật trạng thái giao hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái");
    },
  });

  const deliverOrderMutation = useMutation({
    mutationFn: () => orderService.updateOrderStatus(id!, { status: "DELIVERED" }),
    onSuccess: () => {
      message.success("Xác nhận giao hàng thành công!");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xác nhận giao hàng");
    },
  });

  const order: Order | undefined = data?.data;

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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      SHIPPING: "Đang giao",
      DELIVERED: "Đã giao",
      CANCELLED: "Đã hủy",
    };
    return labels[status] || status;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <PageTitle title="Chi tiết đơn hàng" />
        <Card>
          <div className="text-center py-10">
            <p className="text-red-500">
              {error
                ? "Có lỗi xảy ra khi tải thông tin đơn hàng"
                : "Không tìm thấy đơn hàng"}
            </p>
            <Button
              type="primary"
              className="mt-4"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/orders")}
            >
              Quay lại danh sách
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const productColumns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_: any, record: Order["products"][0]) => (
        <div>
          <div className="font-medium">{record.productName}</div>
          <div className="text-xs text-gray-500">{record.variantName}</div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "center" as const,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 130,
      align: "right" as const,
      render: (price: number) => <span>{formatPrice(price)} đ</span>,
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 130,
      align: "right" as const,
      render: (_: any, record: Order["products"][0]) => (
        <span className="font-semibold">
          {formatPrice(record.price * record.quantity)} đ
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageTitle title="Chi tiết đơn hàng" />

      {/* Back button */}
      <div className="mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/orders")}
        >
          Quay lại danh sách
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left column - Order Info */}
        <Col xs={24} lg={16}>
          {/* Customer Info */}
          <Card title="Thông tin khách hàng" className="mb-4!">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <UserOutlined className="text-blue-500 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Họ tên</div>
                  <div className="font-medium">{order.customerName}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <PhoneOutlined className="text-green-500 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Số điện thoại</div>
                  <div className="font-medium">{order.customerPhone}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <MailOutlined className="text-purple-500 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{order.customerEmail || "—"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <EnvironmentOutlined className="text-orange-500 text-lg" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Địa chỉ</div>
                  <div className="font-medium">{order.address}</div>
                </div>
              </div>

              {order.note && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <FileTextOutlined className="text-gray-500 text-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Ghi chú</div>
                    <div className="font-medium">{order.note}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Products */}
          <Card title="Danh sách sản phẩm">
            <Table
              dataSource={order.products}
              columns={productColumns}
              rowKey={(_record, index) => index ?? `row-${index}`}
              pagination={false}
              size="small"
            />

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatPrice(order.subtotal)} đ</span>
              </div>
              {order.discountAmount > 0 && order.coupon && (
                <div className="flex justify-between text-green-600">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span>Giảm giá:</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        {order.coupon.code}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {order.coupon.type === "PERCENTAGE"
                        ? `${order.coupon.value}%`
                        : `${formatPrice(order.coupon.value)} đ`}
                    </span>
                  </div>
                  <span>-{formatPrice(order.discountAmount)} đ</span>
                </div>
              )}
              <Divider className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-green-600">
                  {formatPrice(order.totalPrice)} đ
                </span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right column - Status & Payment */}
        <Col xs={24} lg={8}>
          {/* Order Status */}
          <Card title="Trạng thái đơn hàng" className="mb-4!">
            <div className="space-y-3">
              <div>
                <span className="text-gray-500">Trạng thái: </span>
                <Tag color={getStatusColor(order.status)} className="ml-2">
                  {getStatusLabel(order.status)}
                </Tag>
              </div>
              <div>
                <span className="text-gray-500">Thanh toán: </span>
                <Tag
                  color={getPaymentStatusColor(order.paymentStatus)}
                  className="ml-2"
                >
                  {order.paymentStatus === "PAID"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </Tag>
              </div>
              <div>
                <span className="text-gray-500">Phương thức: </span>
                <span>{order.paymentMethod === "COD" ? "COD" : "VNPay"}</span>
              </div>
              {order.vnpTransactionId && (
                <div>
                  <span className="text-gray-500">Mã giao dịch: </span>
                  <span className="text-xs">{order.vnpTransactionId}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Update Status Buttons */}
          <Card title="Cập nhật trạng thái" className="mb-4!">
            <div className="space-y-3">
              {order.status === "PENDING" && (
                <div className="space-y-2">
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    block
                    loading={confirmOrderMutation.isPending}
                    onClick={() => {
                      Modal.confirm({
                        title: "Xác nhận đơn hàng",
                        content: "Bạn có chắc chắn muốn xác nhận đơn hàng này?",
                        okText: "Xác nhận",
                        cancelText: "Hủy",
                        okButtonProps: { loading: confirmOrderMutation.isPending },
                        onOk: () => confirmOrderMutation.mutate(),
                      });
                    }}
                  >
                    Xác nhận đơn hàng
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    block
                    loading={cancelOrderMutation.isPending}
                    onClick={() => {
                      Modal.confirm({
                        title: "Hủy đơn hàng",
                        content: "Bạn có chắc chắn muốn hủy đơn hàng này?",
                        okText: "Hủy đơn",
                        cancelText: "Không",
                        okButtonProps: { danger: true, loading: cancelOrderMutation.isPending },
                        onOk: () => cancelOrderMutation.mutate(),
                      });
                    }}
                  >
                    Hủy đơn hàng
                  </Button>
                </div>
              )}
              {order.status === "CONFIRMED" && (
                <div className="space-y-2">
                  <Button
                    type="primary"
                    color="cyan"
                    icon={<CarOutlined />}
                    block
                    loading={shipOrderMutation.isPending}
                    onClick={() => {
                      Modal.confirm({
                        title: "Giao hàng",
                        content: "Bạn có chắc chắn muốn chuyển đơn hàng sang trạng thái đang giao?",
                        okText: "Xác nhận",
                        cancelText: "Hủy",
                        okButtonProps: { loading: shipOrderMutation.isPending },
                        onOk: () => shipOrderMutation.mutate(),
                      });
                    }}
                  >
                    Giao hàng
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    block
                    loading={cancelOrderMutation.isPending}
                    onClick={() => {
                      Modal.confirm({
                        title: "Hủy đơn hàng",
                        content: "Bạn có chắc chắn muốn hủy đơn hàng này?",
                        okText: "Hủy đơn",
                        cancelText: "Không",
                        okButtonProps: { danger: true, loading: cancelOrderMutation.isPending },
                        onOk: () => cancelOrderMutation.mutate(),
                      });
                    }}
                  >
                    Hủy đơn hàng
                  </Button>
                </div>
              )}
              {order.status === "SHIPPING" && (
                <Button
                  type="primary"
                  color="green"
                  icon={<CheckCircleOutlined />}
                  block
                  loading={deliverOrderMutation.isPending}
                  onClick={() => {
                    Modal.confirm({
                      title: "Xác nhận đã giao",
                      content: "Xác nhận đơn hàng đã được giao thành công?",
                      okText: "Xác nhận",
                      cancelText: "Hủy",
                      okButtonProps: { loading: deliverOrderMutation.isPending },
                      onOk: () => deliverOrderMutation.mutate(),
                    });
                  }}
                >
                  Xác nhận đã giao
                </Button>
              )}
              {order.status === "DELIVERED" && (
                <div className="text-center text-green-600 font-medium">
                  <CheckCircleOutlined className="mr-2" />
                  Đơn hàng đã hoàn thành
                </div>
              )}
              {order.status === "CANCELLED" && (
                <div className="text-center text-red-500 font-medium">
                  <CloseCircleOutlined className="mr-2" />
                  Đơn hàng đã bị hủy
                </div>
              )}
            </div>
          </Card>

          {/* Order Timeline */}
          <Card title="Thông tin thời gian">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Ngày tạo">
                {formatDate(order.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {formatDate(order.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailPage;
