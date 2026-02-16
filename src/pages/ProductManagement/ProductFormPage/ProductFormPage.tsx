import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, Form, Button, Space, message } from "antd";
import type { UploadFile } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductImageUploader } from "./ProductImageUploader";
import { ProductVariantList } from "./ProductVariantList";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import { uploadImage } from "../../../services/uploadService";
import type { Color } from "./productForm.types";

const ProductFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const isEditMode = !!id;

  const [imageState, setImageState] = useState({
    urls: [] as string[],
    fileList: [] as UploadFile[],
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      categoryService.getCategories({ limit: 100, isActive: true }),
  });

  const { data: productData } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && productData?.success) {
      const product = productData.data;
      console.log("Product data from API:", product);
      console.log("Variants from API:", product.variants);

      form.setFieldsValue({
        name: product.name,
        category: (product.category as any)._id,
        isActive: product.isActive,
        description: product.description || "",
      });

      if (product.images && product.images.length > 0) {
        const mappedImages = product.images.map(
          (url: string, index: number) => ({
            uid: `-${index}`,
            name: `image-${index}.png`,
            status: "done" as const,
            url: url,
          }),
        );

        setImageState({
          urls: product.images,
          fileList: mappedImages,
        });
      }

      if (product.variants && product.variants.length > 0) {
        const mappedVariants = product.variants.map((v: any) => ({
          _id: v._id,
          size: v.size,
          color: v.color,
          price: v.price,
          stock: v.stock,
          images: v.images || [],
          isActive: v.isActive ?? true,
        }));
        console.log("Mapped variants for form:", mappedVariants);

        form.setFieldsValue({
          variants: mappedVariants,
        });
      }
    }
  }, [isEditMode, productData, form]);

  const handleUpload = async (file: File): Promise<string | boolean> => {
    if (imageState.urls.length >= 5) {
      message.error("Chỉ được tải lên tối đa 5 hình ảnh");
      return false;
    }

    try {
      const response = await uploadImage(file, "products");
      return response.secure_url;
    } catch (error: any) {
      message.error(error.message || "Upload ảnh thất bại");
      throw error;
    }
  };

  const handleRemoveImage = (url: string) => {
    setImageState({
      urls: imageState.urls.filter((imgUrl) => imgUrl !== url),
      fileList: imageState.fileList.filter((file) => file.url !== url),
    });
  };

  const uploadingFilesRef = useRef<Set<string>>(new Set());

  const handleUploadChange = async ({ fileList: newFileList }: any) => {
    setImageState((prev) => ({ ...prev, fileList: newFileList }));

    for (const file of newFileList) {
      const fileKey = file.uid;

      if (
        file.originFileObj &&
        !file.url &&
        file.status !== "done" &&
        file.status !== "uploading" &&
        !uploadingFilesRef.current.has(fileKey)
      ) {
        uploadingFilesRef.current.add(fileKey);
        file.status = "uploading";
        setImageState((prev) => ({ ...prev, fileList: [...newFileList] }));

        try {
          const url = await handleUpload(file.originFileObj);

          if (typeof url === "string") {
            file.url = url;
            file.status = "done";
            setImageState((prev) => ({
              ...prev,
              urls: [...prev.urls, url],
            }));
          }
        } catch {
          file.status = "error";
        } finally {
          uploadingFilesRef.current.delete(fileKey);
        }

        setImageState((prev) => ({ ...prev, fileList: [...newFileList] }));
      }
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => productService.createProduct(data),
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công!");
      form.resetFields();
      navigate("/products");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => productService.updateProduct(id, data),
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công!");
      navigate("/products");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleSubmit = async (values: any) => {
    if (!values.variants || values.variants.length === 0) {
      message.error("Sản phẩm phải có ít nhất một biến thể!");
      return;
    }

    const validVariants = values.variants.filter(
      (v: any) =>
        v.size && v.color?.name && v.color?.hex && v.price >= 0 && v.stock >= 0,
    );

    if (validVariants.length === 0) {
      message.error("Vui lòng điền đầy đủ thông tin cho ít nhất một biến thể!");
      return;
    }

    const data = {
      name: values.name,
      description: values.description,
      category: values.category,
      images: imageState.urls,
      variants: validVariants.map((v: any) => {
        const variantData: any = {
          size: v.size,
          color: {
            name: v.color.name,
            hex: v.color.hex,
          } as Color,
          price: v.price,
          stock: v.stock,
          images: v.images || [],
          isActive: v.isActive,
        };

        if (v._id) {
          variantData._id = v._id;
        }

        return variantData;
      }),
      isActive: values.isActive,
    };

    if (isEditMode) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div>
      <PageTitle title={isEditMode ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm"} />
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          initialValues={{
            isActive: true,
            variants: [],
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductBasicInfo categoriesData={categoriesData} />

            <div className="space-y-4">
              <Form.Item label="Hình ảnh sản phẩm">
                <ProductImageUploader
                  imageUrls={imageState.urls}
                  fileList={imageState.fileList}
                  maxImages={5}
                  onUploadChange={handleUploadChange}
                  onRemoveImage={handleRemoveImage}
                />
              </Form.Item>
            </div>
          </div>

          <ProductVariantList form={form} />

          <Form.Item className="mt-6 pt-6! border-t border-gray-200">
            <Space>
              <Button
                type="default"
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/products")}
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
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

export default ProductFormPage;
