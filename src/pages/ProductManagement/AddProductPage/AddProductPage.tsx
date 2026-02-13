import { useState } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Upload,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import PageTitle from "../../../components/PageTitle/PageTitle";

const { TextArea } = Input;
const { Option } = Select;

interface ProductFormValues {
  name: string;
  category: string;
  price: number | null;
  stock: number | null;
  status: boolean;
  description: string;
}

const AddProductPage = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onFinish = (values: ProductFormValues) => {
    console.log("Form values:", values);
    console.log("Uploaded files:", fileList);
    message.success("Sản phẩm đã được thêm thành công!");
  };

  const onReset = () => {
    form.resetFields();
    setFileList([]);
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    fileList,
    beforeUpload: () => false,
    onChange: (info: UploadChangeParam<UploadFile>) => {
      setFileList(info.fileList);
    },
  };

  return (
    <div>
      <PageTitle title="Thêm Sản Phẩm" />
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                ]}
              >
                <Input placeholder="Nhập tên sản phẩm" size="large" />
              </Form.Item>

              <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục" size="large">
                  <Option value="electronics">Điện tử</Option>
                  <Option value="clothing">Thời trang</Option>
                  <Option value="food">Thực phẩm</Option>
                  <Option value="beauty">Làm đẹp</Option>
                  <Option value="home">Đồ gia dụng</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Giá (VND)"
                name="price"
                rules={[
                  { required: true, message: "Vui lòng nhập giá sản phẩm" },
                ]}
              >
                <InputNumber
                  placeholder="Nhập giá"
                  size="large"
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  min={0}
                />
              </Form.Item>

              <Form.Item
                label="Số lượng tồn kho"
                name="stock"
                rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
              >
                <InputNumber
                  placeholder="Nhập số lượng"
                  size="large"
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>

              <Form.Item
                label="Trạng thái"
                name="status"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <Form.Item label="Hình ảnh sản phẩm">
                <Upload {...uploadProps} listType="picture-card">
                  {fileList.length < 5 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                <div className="text-sm text-gray-500 mt-2">
                  Tối đa 5 hình ảnh, mỗi hình ảnh tối đa 5MB
                </div>
              </Form.Item>

              <Form.Item
                label="Mô tả sản phẩm"
                name="description"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả sản phẩm" },
                ]}
              >
                <TextArea
                  rows={8}
                  placeholder="Nhập mô tả chi tiết về sản phẩm"
                />
              </Form.Item>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<PlusOutlined />}
            >
              Lưu Sản Phẩm
            </Button>
            <Button size="large" onClick={onReset}>
              Hủy
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddProductPage;
