import { Form, Card, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { ProductVariantForm } from "./ProductVariantForm";

interface ProductVariantListProps {
  form: FormInstance;
}

export const ProductVariantList = ({ form }: ProductVariantListProps) => {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Biến thể sản phẩm</h3>
      <Form.List name="variants">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                className="mb-4!"
                extra={
                  fields.length > 1 && (
                    <Button
                      danger
                      size="small"
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    >
                      Xóa
                    </Button>
                  )
                }
              >
                <ProductVariantForm
                  form={form}
                  fieldName={name}
                  restField={restField}
                />
              </Card>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                className="w-full"
              >
                Thêm biến thể
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};
