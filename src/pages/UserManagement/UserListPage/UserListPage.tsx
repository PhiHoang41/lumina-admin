import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

const useDebounce = (value: string, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
import dayjs from "dayjs";
import {
  Card,
  Table,
  Button,
  Dropdown,
  Modal,
  message,
  Tag,
  Space,
  Input,
  Select,
  Avatar,
  Form,
} from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PlusOutlined,
  LockOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import PageTitle from "../../../components/PageTitle/PageTitle";
import userService, { type User } from "../../../services/userService";
import { useAuth } from "../../../hooks/useAuth";

const UserListPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [changePasswordForm] = Form.useForm();
  const debouncedSearch = useDebounce(search, 500);
  const { user: currentUser } = useAuth();

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", pagination.current, pagination.pageSize, debouncedSearch, roleFilter],
    queryFn: () =>
      userService.getUsers({
        page: pagination.current,
        limit: pagination.pageSize,
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
      }),
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    if (pagination.current !== 1) {
      setPagination({ ...pagination, current: 1 });
    }
  };

  const handleRoleFilter = (value: string | undefined) => {
    setRoleFilter(value || "");
    if (pagination.current !== 1) {
      setPagination({ current: 1, pageSize: pagination.pageSize });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      message.success("Đã xóa tài khoản thành công!");
      refetch();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xóa tài khoản");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (newPassword: string) =>
      userService.adminChangePassword(selectedUser!._id, newPassword),
    onSuccess: () => {
      message.success("Đổi mật khẩu thành công!");
      setIsChangePasswordOpen(false);
      changePasswordForm.resetFields();
      setSelectedUser(null);
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi đổi mật khẩu");
    },
  });

  const handleOpenChangePassword = (user: User) => {
    setSelectedUser(user);
    setIsChangePasswordOpen(true);
  };

  const handleChangePassword = (values: { newPassword: string; confirmPassword: string }) => {
    changePasswordMutation.mutate(values.newPassword);
  };

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa tài khoản "${name}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const getActionMenu = (record: User): MenuProps => {
    const isCurrentUser = currentUser?._id === record._id;

    return {
      items: [
        {
          key: "edit",
          icon: <EditOutlined />,
          label: "Chỉnh sửa",
          onClick: () => navigate(`/users/edit/${record._id}`),
        },
        {
          key: "changePassword",
          icon: <LockOutlined />,
          label: "Đổi mật khẩu",
          onClick: () => handleOpenChangePassword(record),
        },
        {
          type: "divider",
        },
        {
          key: "delete",
          icon: <DeleteOutlined />,
          label: "Xóa",
          danger: true,
          disabled: isCurrentUser,
          onClick: () => handleDelete(record._id, record.fullName),
        },
      ],
    };
  };

  const columns: ColumnsType<User> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "Người dùng",
      key: "user",
      width: 250,
      render: (_, record) => {
        const hasAvatar = record.avatar && record.avatar.trim() !== "";
        return (
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              src={hasAvatar ? record.avatar : undefined}
              icon={!hasAvatar && <UserOutlined />}
              className="bg-blue-500"
            />
            <div>
              <div className="font-medium">{record.fullName}</div>
              <div className="text-gray-500 text-sm">{record.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 130,
      render: (phone: string) => phone || <span className="text-gray-400">-</span>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 180,
      ellipsis: true,
      render: (address: string) => address || <span className="text-gray-400">-</span>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (role: string) => (
        <Tag color={role === "ADMIN" ? "blue" : "default"}>
          {role === "ADMIN" ? "Admin" : "User"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
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
      <PageTitle title="Quản Lý Tài Khoản" />
      <Card>
        <div className="mb-4 flex justify-between items-center gap-4 flex-wrap">
          <Space wrap>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 200 }}
              allowClear
              onClear={() => {
                setSearch("");
              }}
              size="large"
            />
            <Select
              placeholder="Lọc theo vai trò"
              value={roleFilter || undefined}
              onChange={handleRoleFilter}
              style={{ width: 150 }}
              allowClear
              options={[
                { value: "USER", label: "User" },
                { value: "ADMIN", label: "Admin" },
              ]}
              size="large"
            />
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/users/create")}
            size="large"
          >
            Thêm tài khoản
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={usersData?.data?.users || []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: usersData?.data?.pagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} tài khoản`,
            hideOnSinglePage: true,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title="Đổi mật khẩu"
        open={isChangePasswordOpen}
        onCancel={() => {
          setIsChangePasswordOpen(false);
          changePasswordForm.resetFields();
          setSelectedUser(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <div className="mb-4">
            <strong>Tài khoản:</strong> {selectedUser?.fullName}
            <br />
            <span className="text-gray-500">Email: {selectedUser?.email}</span>
          </div>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space>
              <Button onClick={() => {
                setIsChangePasswordOpen(false);
                changePasswordForm.resetFields();
                setSelectedUser(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={changePasswordMutation.isPending}>
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserListPage;
