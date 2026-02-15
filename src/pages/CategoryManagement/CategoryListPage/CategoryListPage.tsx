import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  Card,
  Table,
  Button,
  Dropdown,
  Modal,
  message,
  Switch,
  Image,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import PageTitle from "../../../components/PageTitle/PageTitle";
import categoryService, {
  type Category,
} from "../../../services/categoryService";

const CategoryListPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const {
    data: categoriesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["categories", pagination.current, pagination.pageSize],
    queryFn: () =>
      categoryService.getCategories({
        page: pagination.current,
        limit: pagination.pageSize,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      message.success("Đã xóa danh mục thành công!");
      refetch();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xóa danh mục");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, name, image, isActive }: any) =>
      categoryService.updateCategory(id, { name, image, isActive }),
    onSuccess: () => {
      message.success("Đã cập nhật trạng thái danh mục!");
      refetch();
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái",
      );
    },
  });

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa danh mục "${name}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const handleToggleStatus = (category: Category) => {
    toggleStatusMutation.mutate({
      id: category._id,
      name: category.name,
      image: category.image,
      isActive: !category.isActive,
    });
  };

  const getActionMenu = (record: Category): MenuProps => {
    return {
      items: [
        {
          key: "edit",
          icon: <EditOutlined />,
          label: "Chỉnh sửa",
          onClick: () => navigate(`/categories/edit/${record._id}`),
        },
        {
          type: "divider",
        },
        {
          key: "delete",
          icon: <DeleteOutlined />,
          label: "Xóa",
          danger: true,
          onClick: () => handleDelete(record._id, record.name),
        },
      ],
    };
  };

  const columns: ColumnsType<Category> = [
    {
      title: "ID",
      dataIndex: "_id",
      width: 200,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      width: 100,
      render: (image: string | null) =>
        image ? (
          <Image
            src={image}
            alt="category"
            width={60}
            height={60}
            className="object-cover rounded"
          />
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      width: 200,
      ellipsis: true,
      render: (slug: string) => <span className="text-gray-500">{slug}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      width: 120,
      render: (isActive: boolean, record: Category) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStatus(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 150,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
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
      <PageTitle title="Quản Lý Danh Mục" />
      <Card>
        <div className="mb-4 flex justify-end">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/categories/add")}
          >
            Thêm Danh Mục
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categoriesData?.data || []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: categoriesData?.pagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} danh mục`,
            hideOnSinglePage: true,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default CategoryListPage;
