import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  type MenuProps,
  Modal,
  message,
} from "antd";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  GiftOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, isLoading } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: async () => logout(),
    onSuccess: () => {
      message.success("Đăng xuất thành công!");
      window.location.href = "/login";
    },
  });

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "/categories",
      icon: <AppstoreOutlined />,
      label: <Link to="/categories">Categories</Link>,
    },
    {
      key: "/products",
      icon: <ShoppingOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: "/coupons",
      icon: <GiftOutlined />,
      label: <Link to="/coupons">Coupons</Link>,
    },
    {
      key: "/users",
      icon: <TeamOutlined />,
      label: <Link to="/users">Users</Link>,
    },
    {
      key: "/orders",
      icon: <FileTextOutlined />,
      label: <Link to="/orders">Orders</Link>,
    },
  ];

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      onOk: () => {
        logoutMutation.mutate();
      },
    });
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="h-screen overflow-hidden">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={265}
        className="h-full fixed left-0 top-0 z-20"
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">
            {collapsed ? "L" : "Lumina Admin"}
          </h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          theme="light"
          className="border-r-0 overflow-y-auto"
          style={{ height: "calc(100vh - 64px)" }}
        />
      </Sider>
      <Layout className="ml-0 transition-all duration-300">
        <Header className="fixed top-0 right-0 left-0 h-16 bg-white! flex items-center justify-end px-6 shadow-sm z-10 transition-all duration-300">
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar size={32} icon={<UserOutlined />} />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {isLoading ? "Loading..." : user?.fullName || "Admin"}
                </div>
                <div className="text-xs text-gray-500">
                  {isLoading ? "" : user?.email || "admin@lumina.com"}
                </div>
              </div>
            </div>
          </Dropdown>
        </Header>
        <Content className="mt-16 p-6 overflow-y-auto h-[calc(100vh-64px)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
