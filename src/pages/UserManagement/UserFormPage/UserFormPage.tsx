import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Button, Card, Select, message, Spin, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { AvatarUploader } from "../../../components/AvatarUploader/AvatarUploader";
import userService, {
  type User,
  type CreateUserData,
} from "../../../services/userService";

interface FormValues {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  role: "USER" | "ADMIN";
  avatar?: string;
}

const UserFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const avatarValue = Form.useWatch("avatar", form);

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (userData?.data) {
      form.setFieldsValue({
        fullName: userData.data.fullName,
        email: userData.data.email,
        phone: userData.data.phone || "",
        address: userData.data.address || "",
        role: userData.data.role,
        avatar: userData.data.avatar || "",
      });
    }
  }, [userData, form]);

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [form]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<User>) => userService.updateUser(id!, data),
    onSuccess: () => {
      message.success("Cập nhật tài khoản thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      navigate("/users");
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Lỗi khi cập nhật tài khoản",
      );
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      message.success("Tạo tài khoản thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi tạo tài khoản");
    },
  });

  const onFinish = (values: FormValues) => {
    if (isEditMode) {
      // Chỉnh sửa - loại bỏ các trường không cần thiết
      const { password, ...updateData } = values;
      updateMutation.mutate(updateData);
    } else {
      // Tạo mới - lọc bỏ các trường empty
      const createData: CreateUserData = {
        fullName: values.fullName,
        email: values.email,
        password: values.password!,
        phone: values.phone?.trim() || undefined,
        address: values.address?.trim() || undefined,
        role: values.role,
        avatar: values.avatar?.trim() || undefined,
      };
      createMutation.mutate(createData);
    }
  };

  if (isEditMode && isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  const isLoading = updateMutation.isPending || createMutation.isPending;

  return (
    <div>
      <PageTitle
        title={isEditMode ? "Chỉnh Sửa Tài Khoản" : "Thêm Tài Khoản"}
      />
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            role: "USER",
          }}
          size="large"
        >
          <Form.Item label="Avatar" className="text-center">
            <Form.Item name="avatar" hidden noStyle>
              <Input />
            </Form.Item>
            <AvatarUploader
              value={avatarValue}
              onChange={(value) => form.setFieldsValue({ avatar: value })}
            />
          </Form.Item>

          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không đúng định dạng" },
            ]}
          >
            <Input placeholder="Nhập email" disabled={isEditMode} />
          </Form.Item>

          {!isEditMode && (
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          <Form.Item label="Số điện thoại" name="phone">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select
              options={[
                { value: "USER", label: "User" },
                { value: "ADMIN", label: "Admin" },
              ]}
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/users")}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {isEditMode ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserFormPage;
