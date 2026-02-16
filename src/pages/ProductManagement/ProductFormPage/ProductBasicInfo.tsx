import { Form, Input, InputNumber, Select, Switch } from "antd";

const { TextArea } = Input;
const { Option } = Select;

interface ProductBasicInfoProps {
  categoriesData: any;
}

export const ProductBasicInfo = ({ categoriesData }: ProductBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
      >
        <Input placeholder="Nhập tên sản phẩm" size="large" />
      </Form.Item>

      <Form.Item
        label="Danh mục"
        name="category"
        rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
      >
        <Select
          placeholder="Chọn danh mục"
          size="large"
          loading={!categoriesData}
        >
          {categoriesData?.data?.map((cat: any) => (
            <Option key={cat._id} value={cat._id}>
              {cat.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item
        label="Mô tả sản phẩm"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm" }]}
      >
        <TextArea rows={8} placeholder="Nhập mô tả chi tiết về sản phẩm" />
      </Form.Item>
    </div>
  );
};
