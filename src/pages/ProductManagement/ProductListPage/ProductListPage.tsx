import { useState } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Select,
  Tag,
  Dropdown,
  Modal,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import PageTitle from "../../../components/PageTitle/PageTitle";

const { Search } = Input;
const { Option } = Select;

interface Product {
  key: string;
  id: number;
  image: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
}

const ProductListPage = () => {
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const mockProducts: Product[] = [
    {
      key: "1",
      id: 1,
      image: "https://picsum.photos/300/300",
      name: "iPhone 15 Pro Max",
      category: "Điện tử",
      price: 34990000,
      stock: 25,
      status: "active",
    },
    {
      key: "2",
      id: 2,
      image: "https://picsum.photos/300/300",
      name: "MacBook Air M3",
      category: "Điện tử",
      price: 28990000,
      stock: 15,
      status: "active",
    },
    {
      key: "3",
      id: 3,
      image: "https://picsum.photos/300/300",
      name: "Áo khoác mùa đông",
      category: "Thời trang",
      price: 1250000,
      stock: 50,
      status: "active",
    },
    {
      key: "4",
      id: 4,
      image: "https://picsum.photos/300/300",
      name: "Giày thể thao Nike",
      category: "Thời trang",
      price: 3200000,
      stock: 0,
      status: "inactive",
    },
    {
      key: "5",
      id: 5,
      image: "https://picsum.photos/300/300",
      name: "Kem dưỡng da",
      category: "Làm đẹp",
      price: 850000,
      stock: 100,
      status: "active",
    },
    {
      key: "6",
      id: 6,
      image: "https://picsum.photos/300/300",
      name: "Nồi chiên không dầu",
      category: "Đồ gia dụng",
      price: 2500000,
      stock: 30,
      status: "active",
    },
    {
      key: "7",
      id: 7,
      image: "https://picsum.photos/300/300",
      name: "Tai nghe Bluetooth",
      category: "Điện tử",
      price: 1800000,
      stock: 45,
      status: "active",
    },
    {
      key: "8",
      id: 8,
      image: "https://picsum.photos/300/300",
      name: "Túi xách nữ",
      category: "Thời trang",
      price: 2100000,
      stock: 20,
      status: "inactive",
    },
  ];

  const filteredProducts = mockProducts.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchCategory = filterCategory
      ? product.category === filterCategory
      : true;
    const matchStatus = filterStatus ? product.status === filterStatus : true;
    return matchSearch && matchCategory && matchStatus;
  });

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        console.log("Deleting product with ID:", id);
        message.success("Đã xóa sản phẩm thành công!");
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }
    Modal.confirm({
      title: "Xác nhận xóa hàng loạt",
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} sản phẩm đã chọn?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        message.success(
          `Đã xóa ${selectedRowKeys.length} sản phẩm thành công!`,
        );
        setSelectedRowKeys([]);
      },
    });
  };

  const getActionMenu = (record: Product): MenuProps => {
    return {
      items: [
        {
          key: "edit",
          icon: <EditOutlined />,
          label: "Chỉnh sửa",
          onClick: () => message.info(`Chỉnh sửa sản phẩm: ${record.name}`),
        },
        {
          type: "divider",
        },
        {
          key: "delete",
          icon: <DeleteOutlined />,
          label: "Xóa",
          danger: true,
          onClick: () => handleDelete(record.id),
        },
      ],
    };
  };

  const columns: ColumnsType<Product> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
      align: "center",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      width: 80,
      render: (image: string) => (
        <img
          src={image}
          alt="product"
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      width: 120,
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: 130,
      render: (price: number) => (
        <span className="font-semibold text-green-600">
          {price.toLocaleString("vi-VN")} đ
        </span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "stock",
      width: 100,
      align: "center",
      render: (stock: number) => (
        <span className={stock === 0 ? "text-red-500 font-semibold" : ""}>
          {stock}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 110,
      render: (status: string) => (
        <Tag
          color={status === "active" ? "green" : "red"}
          className="capitalize"
        >
          {status === "active" ? "Active" : "Inactive"}
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
        {/* Header with search and filters */}
        <div className="mb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
              <Search
                placeholder="Tìm kiếm sản phẩm..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                style={{ maxWidth: 400, width: "100%" }}
                onSearch={setSearchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Select
                placeholder="Danh mục"
                allowClear
                size="large"
                style={{ width: 150 }}
                onChange={setFilterCategory}
                value={filterCategory}
              >
                <Option value="Điện tử">Điện tử</Option>
                <Option value="Thời trang">Thời trang</Option>
                <Option value="Thực phẩm">Thực phẩm</Option>
                <Option value="Làm đẹp">Làm đẹp</Option>
                <Option value="Đồ gia dụng">Đồ gia dụng</Option>
              </Select>
              <Select
                placeholder="Trạng thái"
                allowClear
                size="large"
                style={{ width: 130 }}
                onChange={setFilterStatus}
                value={filterStatus}
              >
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </div>
            <div className="flex gap-2 w-full lg:w-auto">
              {selectedRowKeys.length > 0 && (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBulkDelete}
                >
                  Xóa ({selectedRowKeys.length})
                </Button>
              )}
              <Button type="primary" size="large" icon={<PlusOutlined />}>
                Thêm Sản Phẩm
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredProducts.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} sản phẩm`,
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize });
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default ProductListPage;
