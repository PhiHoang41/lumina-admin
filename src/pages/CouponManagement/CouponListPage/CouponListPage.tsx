import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, Table, Button, Tag, Dropdown, Modal, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import PageTitle from "../../../components/PageTitle/PageTitle";
import couponService from "../../../services/couponService";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const CouponListPage = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["coupons", pagination.current, pagination.pageSize],
    queryFn: () =>
      couponService.getCoupons({
        page: pagination.current,
        limit: pagination.pageSize,
      }),
  });

  const coupons = data?.data.coupons || [];
  const total = data?.data.pagination.total || 0;

  const deleteMutation = useMutation({
    mutationFn: couponService.deleteCoupon,
    onSuccess: () => {
      message.success("Đã xóa mã giảm giá thành công!");
      refetch();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xóa mã giảm giá");
    },
  });

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa mã giảm giá này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        deleteMutation.mutate(id);
      },
    });
  };

  const handleEdit = (id: string) => {
    navigate(`/coupons/edit/${id}`);
  };

  const getActionMenu = (record: any): MenuProps => {
    return {
      items: [
        {
          key: "edit",
          icon: <EditOutlined />,
          label: "Chỉnh sửa",
          onClick: () => handleEdit(record._id),
        },
        {
          type: "divider",
        },
        {
          key: "delete",
          icon: <DeleteOutlined />,
          label: "Xóa",
          danger: true,
          onClick: () => handleDelete(record._id),
        },
      ],
    };
  };

  const formatValue = (type: string, value: number) => {
    if (type === "PERCENTAGE") {
      return `${value}%`;
    }
    return `${value.toLocaleString("vi-VN")} đ`;
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  const columns: ColumnsType<any> = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (code: string) => (
        <span className="font-semibold text-blue-600">{code}</span>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: string) => (
        <Tag color={type === "PERCENTAGE" ? "blue" : "green"}>
          {type === "PERCENTAGE" ? "Phần trăm" : "Cố định"}
        </Tag>
      ),
    },
    {
      title: "Giá trị giảm",
      dataIndex: "value",
      key: "value",
      width: 120,
      render: (value: number, record: any) => (
        <span className="font-semibold text-red-500">
          {formatValue(record.type, value)}
        </span>
      ),
    },
    {
      title: "Min Order",
      dataIndex: "minOrderAmount",
      key: "minOrderAmount",
      width: 120,
      render: (amount: number) => (
        <span className="text-gray-600">
          {amount === 0 ? "0 đ" : `${amount.toLocaleString("vi-VN")} đ`}
        </span>
      ),
    },
    {
      title: "Số lần dùng",
      dataIndex: "usageLimit",
      key: "usageLimit",
      width: 120,
      align: "center",
      render: (usageLimit: number | undefined, record: any) => {
        if (!usageLimit) {
          return <span className="text-gray-500">Không giới hạn</span>;
        }
        return `${record.usedCount}/${usageLimit}`;
      },
    },
    {
      title: "Ngày hiệu lực",
      key: "validDate",
      width: 200,
      render: (_: any, record: any) => (
        <span className="text-sm">
          {formatDate(record.validFrom)} - {formatDate(record.validTo)}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          ACTIVE: "green",
          INACTIVE: "default",
          EXPIRED: "red",
        };
        const labelMap: Record<string, string> = {
          ACTIVE: "Active",
          INACTIVE: "Inactive",
          EXPIRED: "Hết hạn",
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <PageTitle title="Danh Sách Mã Giảm Giá" />
      <Card>
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-end">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate("/coupons/add")}
            >
              Thêm Mã Giảm Giá
            </Button>
          </div>
        </div>

        {error ? (
          <div className="text-center py-10">
            <p className="text-red-500">
              Có lỗi xảy ra khi tải danh sách mã giảm giá
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={coupons}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng ${total} mã giảm giá`,
              onChange: (page, pageSize) => {
                setPagination({
                  current: page,
                  pageSize: pageSize || 10,
                });
              },
              hideOnSinglePage: true,
            }}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
    </div>
  );
};

export default CouponListPage;
