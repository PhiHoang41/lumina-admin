import {
  Form,
  Input,
  InputNumber,
  ColorPicker,
  Switch,
  Button,
  Upload,
  Image,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import type { FormInstance } from "antd";
import { uploadImage } from "../../../services/uploadService";
import { useState } from "react";

const uploadingFilesMap = new Map<string, boolean>();

interface ProductVariantFormProps {
  form: FormInstance;
  fieldName: number;
  restField: any;
}

export const ProductVariantForm = ({
  form,
  fieldName,
  restField,
}: ProductVariantFormProps) => {
  const [uploadingImages, setUploadingImages] = useState<
    Map<string, { name: string; preview?: string }>
  >(new Map());

  const handleVariantImageUpload = async (file: File, fileKey: string) => {
    const uniqueKey = `${fieldName}-${fileKey}`;

    if (uploadingFilesMap.has(uniqueKey)) {
      return false;
    }

    uploadingFilesMap.set(uniqueKey, true);

    const preview = URL.createObjectURL(file);
    setUploadingImages((prev) => {
      const newMap = new Map(prev);
      newMap.set(uniqueKey, { name: file.name, preview });
      return newMap;
    });

    try {
      const response = await uploadImage(file, "variants");
      const currentImages =
        form.getFieldValue(["variants", fieldName, "images"]) || [];
      const newImages = [...currentImages, response.secure_url];
      form.setFieldValue(["variants", fieldName, "images"], newImages);
      return false;
    } catch (error: any) {
      message.error(error.message || "Upload ảnh thất bại");
      return false;
    } finally {
      uploadingFilesMap.delete(uniqueKey);
      setUploadingImages((prev) => {
        const newMap = new Map(prev);
        newMap.delete(uniqueKey);
        const item = prev.get(uniqueKey);
        if (item?.preview) {
          URL.revokeObjectURL(item.preview);
        }
        return newMap;
      });
    }
  };

  return (
    <div>
      <Form.Item {...restField} name={[fieldName, "_id"]} hidden>
        <input type="hidden" />
      </Form.Item>

      <Form.Item
        {...restField}
        name={[fieldName, "images"]}
        hidden
        initialValue={[]}
      >
        <input type="hidden" />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          {...restField}
          name={[fieldName, "size"]}
          rules={[{ required: true, message: "Vui lòng nhập kích thước" }]}
        >
          <Input placeholder="VD: S, M, L, XL" size="large" />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[fieldName, "color", "name"]}
          rules={[{ required: true, message: "Vui lòng nhập tên màu" }]}
        >
          <Input placeholder="VD: Đỏ, Xanh, Đen" size="large" />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[fieldName, "color", "hex"]}
          getValueFromEvent={(color) => color.toHexString()}
          rules={[{ required: true, message: "Vui lòng chọn màu" }]}
        >
          <ColorPicker showText format="hex" />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[fieldName, "price"]}
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber
            placeholder="Nhập giá"
            size="large"
            className="w-full!"
            min={0}
          />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[fieldName, "stock"]}
          rules={[{ required: true, message: "Vui lòng nhập tồn kho" }]}
        >
          <InputNumber
            placeholder="Nhập số lượng"
            size="large"
            className="w-full!"
            min={0}
          />
        </Form.Item>
      </div>

      <Form.Item label="Hình ảnh biến thể">
        <Form.Item noStyle shouldUpdate>
          {() => {
            const variantImages =
              form.getFieldValue(["variants", fieldName, "images"]) || [];
            return (
              <div>
                {variantImages.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {variantImages.map((url: string, imgIdx: number) => (
                      <div key={imgIdx} className="flex items-center gap-3">
                        <Image
                          src={url}
                          alt={`Variant image ${imgIdx + 1}`}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                        <Button
                          danger
                          size="small"
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            const newImages = variantImages.filter(
                              (_: string, i: number) => i !== imgIdx,
                            );
                            form.setFieldValue(
                              ["variants", fieldName, "images"],
                              newImages,
                            );
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadingImages.size > 0 && (
                  <div className="space-y-2 mb-3">
                    {Array.from(uploadingImages.entries()).map(
                      ([key, { name, preview }]) => (
                        <div
                          key={key}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <div className="relative">
                            {preview ? (
                              <img
                                src={preview}
                                alt="Uploading preview"
                                className="w-15 h-15 rounded object-cover"
                              />
                            ) : (
                              <div className="w-15 h-15 rounded bg-gray-200 flex items-center justify-center">
                                <LoadingOutlined className="text-lg text-gray-400" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded flex items-center justify-center">
                              <Spin
                                indicator={
                                  <LoadingOutlined
                                    className="text-white text-lg"
                                    spin
                                  />
                                }
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-700">
                              {name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Đang tải lên...
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                {/* Upload button */}
                {variantImages.length + uploadingImages.size < 3 && (
                  <Upload
                    fileList={[]}
                    accept="image/*"
                    multiple
                    customRequest={() => {}}
                    showUploadList={false}
                    onChange={async ({ fileList: newFileList }) => {
                      for (const file of newFileList) {
                        if (
                          file.originFileObj &&
                          !file.url &&
                          file.status !== "done"
                        ) {
                          await handleVariantImageUpload(
                            file.originFileObj,
                            file.uid,
                          );
                        }
                      }
                    }}
                  >
                    <Button icon={<PlusOutlined />} size="small">
                      Thêm ảnh
                    </Button>
                  </Upload>
                )}

                <div className="text-xs text-gray-500 mt-1">
                  Tối đa 3 hình ảnh.
                  {uploadingImages.size > 0 && (
                    <span className="ml-2 text-blue-500">
                      ({uploadingImages.size} đang tải lên)
                    </span>
                  )}
                </div>
              </div>
            );
          }}
        </Form.Item>
      </Form.Item>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Trạng thái:</span>
        <Form.Item
          {...restField}
          name={[fieldName, "isActive"]}
          valuePropName="checked"
          initialValue={true}
          className="mb-0!"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </div>
    </div>
  );
};
