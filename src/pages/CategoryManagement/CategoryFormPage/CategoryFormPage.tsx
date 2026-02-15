import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Switch,
  message,
  Image,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  SaveOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import PageTitle from "../../../components/PageTitle/PageTitle";
import categoryService from "../../../services/categoryService";
import { uploadImage } from "../../../services/uploadService";

const CategoryFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!id;

  const { data: categoryData } = useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (categoryData?.success) {
      const category = categoryData.data;
      form.setFieldsValue({
        name: category.name,
        isActive: category.isActive,
      });
      setFileList(
        category.image
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done" as const,
                url: category.image,
              },
            ]
          : [],
      );
      setImageUrl(category.image || "");
    }
  }, [categoryData, form]);

  const createMutation = useMutation({
    mutationFn: (data: any) => categoryService.createCategory(data),
    onSuccess: () => {
      message.success("Thêm danh mục thành công!");
      handleResetForm();
      navigate("/categories");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      message.success("Cập nhật danh mục thành công!");
      navigate("/categories");
      handleResetForm();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await uploadImage(file, "categories");
      setImageUrl(response.secure_url);

      setFileList([
        {
          uid: "-1",
          name: file.name,
          status: "done" as const,
          url: response.secure_url,
        },
      ]);

      message.success("Upload ảnh thành công!");
      return false;
    } catch (error: any) {
      message.error(error.message || "Upload ảnh thất bại");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      handleUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setFileList([]);
  };

  const handleSubmit = async (values: any) => {
    const data = {
      name: values.name,
      image: imageUrl || null,
      isActive: values.isActive,
    };

    if (isEditMode) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleResetForm = () => {
    form.resetFields([]);
    handleRemoveImage();
  };

  return (
    <div>
      <PageTitle title={isEditMode ? "Cập Nhật Danh Mục" : "Thêm Danh Mục"} />
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
          }}
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Nhập tên danh mục" size="large" />
          </Form.Item>

          <Form.Item label="Hình ảnh">
            {imageUrl ? (
              <div className="flex items-center gap-4">
                <Image
                  src={imageUrl}
                  alt="Category image"
                  width={200}
                  className="rounded"
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleRemoveImage}
                >
                  Xóa ảnh
                </Button>
              </div>
            ) : (
              <Upload
                fileList={fileList}
                onChange={handleUploadChange}
                accept="image/*"
                customRequest={() => {}}
                showUploadList={false}
              >
                <Button
                  icon={isUploading ? <LoadingOutlined /> : <PlusOutlined />}
                  loading={isUploading}
                >
                  {isUploading ? "Đang tải lên..." : "Chọn ảnh"}
                </Button>
              </Upload>
            )}
          </Form.Item>

          <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="default"
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/categories")}
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                htmlType="submit"
                loading={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  isUploading
                }
              >
                {isEditMode ? "Cập Nhật" : "Thêm Mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CategoryFormPage;
