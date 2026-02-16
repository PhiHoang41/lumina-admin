import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, Table, Button, Tag, Dropdown, Modal, message, Spin } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import PageTitle from "../../../components/PageTitle/PageTitle";
import productService, { type Product } from "../../../services/productService";
import { useNavigate } from "react-router-dom";

const ProductListPage = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", pagination.current, pagination.pageSize],
    queryFn: () =>
      productService.getProducts({
        page: pagination.current,
        limit: pagination.pageSize,
      }),
  });

  const products = data?.data || [];
  const total = data?.pagination.total || 0;

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      message.success("Đã xóa sản phẩm thành công!");
      refetch();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: productService.toggleProductStatus,
    onSuccess: () => {
      message.success("Đã cập nhật trạng thái sản phẩm!");
      refetch();
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái",
      );
    },
  });

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        deleteMutation.mutate(id);
      },
    });
  };

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const handleEdit = (id: string) => {
    navigate(`/products/edit/${id}`);
  };

  const getActionMenu = (record: Product): MenuProps => {
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
          key: "toggle",
          icon: <PoweroffOutlined />,
          label: record.isActive ? "Tắt kích hoạt" : "Kích hoạt",
          onClick: () => handleToggleStatus(record._id),
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

  const columns: ColumnsType<Product> = [
    {
      title: "ID",
      dataIndex: "_id",
      width: 200,
      align: "center",
      render: (_id: string) => (
        <span className="text-xs text-gray-500">{_id}</span>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      width: 80,
      render: (images: string[]) =>
        !images || images.length === 0 ? (
          <span className="text-gray-400">-</span>
        ) : (
          <img
            src={images[0]}
            alt="product"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 250,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      width: 150,
      render: (category: any) => (
        <span>
          {typeof category === "object" && category !== null
            ? category.name
            : category}
        </span>
      ),
    },
    {
      title: "Giá",
      dataIndex: "basePrice",
      width: 130,
      render: (basePrice: number) => (
        <span className="font-semibold text-green-600">
          {basePrice.toLocaleString("vi-VN")} đ
        </span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "totalStock",
      width: 100,
      align: "center",
      render: (totalStock: number) => (
        <span className={totalStock === 0 ? "text-red-500 font-semibold" : ""}>
          {totalStock}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      width: 110,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"} className="capitalize">
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
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
      <PageTitle title="Danh Sách Sản Phẩm" />
      <Card>
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-end">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate("/products/add")}
            >
              Thêm Sản Phẩm
            </Button>
          </div>
        </div>

        {error ? (
          <div className="text-center py-10">
            <p className="text-red-500">
              Có lỗi xảy ra khi tải danh sách sản phẩm
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={products}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng ${total} sản phẩm`,
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

export default ProductListPage;
