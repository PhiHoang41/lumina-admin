import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  message,
  Space,
  DatePicker,
  Switch,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import PageTitle from "../../../components/PageTitle/PageTitle";
import couponService from "../../../services/couponService";
import dayjs from "dayjs";

const { TextArea } = Input;

const CouponFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const couponType = Form.useWatch("type", form) as
    | "PERCENTAGE"
    | "FIXED_AMOUNT"
    | undefined;

  const isEditMode = !!id;

  const { data: couponData } = useQuery({
    queryKey: ["coupon", id],
    queryFn: () => couponService.getCouponById(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && couponData?.success) {
      const coupon = couponData.data;
      form.setFieldsValue({
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        usageLimit: coupon.usageLimit,
        allowMultipleUsePerUser: coupon.allowMultipleUsePerUser,
        validFrom: dayjs(coupon.validFrom),
        validTo: dayjs(coupon.validTo),
        status: coupon.status,
      });
    }
  }, [isEditMode, couponData, form]);

  const createMutation = useMutation({
    mutationFn: (data: any) => couponService.createCoupon(data),
    onSuccess: () => {
      message.success("Thêm mã giảm giá thành công!");
      handleResetForm();
      navigate("/coupons");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => couponService.updateCoupon(id, data),
    onSuccess: () => {
      message.success("Cập nhật mã giảm giá thành công!");
      navigate("/coupons");
      handleResetForm();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleSubmit = async (values: any) => {
    const data = {
      code: values.code.toUpperCase(),
      description: values.description,
      type: values.type,
      value: values.value,
      minOrderAmount: values.minOrderAmount || 0,
      maxDiscountAmount: values.maxDiscountAmount,
      usageLimit: values.usageLimit,
      allowMultipleUsePerUser: values.allowMultipleUsePerUser || false,
      validFrom: values.validFrom.toISOString(),
      validTo: values.validTo.toISOString(),
      status: values.status,
    };

    if (isEditMode) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleResetForm = () => {
    form.resetFields();
  };

  const couponTypeOptions = [
    { value: "PERCENTAGE", label: "Phần trăm (%)" },
    { value: "FIXED_AMOUNT", label: "Số tiền cố định (đ)" },
  ];

  const statusOptions = [
    {
      value: "ACTIVE",
      label: <span className="text-green-500">● Active</span>,
    },
    {
      value: "INACTIVE",
      label: <span className="text-gray-500">● Inactive</span>,
    },
    {
      value: "EXPIRED",
      label: <span className="text-red-500">● Hết hạn</span>,
    },
  ];

  return (
    <div>
      <PageTitle
        title={isEditMode ? "Cập Nhật Mã Giảm Giá" : "Thêm Mã Giảm Giá Mới"}
      />
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          initialValues={{
            type: "PERCENTAGE",
            minOrderAmount: 0,
            allowMultipleUsePerUser: false,
            status: "ACTIVE",
          }}
        >
          <Form.Item
            label="Mã giảm giá"
            name="code"
            normalize={(value) => value?.toUpperCase()}
            rules={[
              { required: true, message: "Vui lòng nhập mã giảm giá" },
              {
                pattern: /^[A-Z0-9]+$/,
                message: "Mã chỉ được chứa chữ hoa và số",
              },
            ]}
          >
            <Input placeholder="Ví dụ: SALE2024" size="large" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea
              placeholder="Mô tả về mã giảm giá (tùy chọn)"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Loại giảm giá"
              name="type"
              rules={[
                { required: true, message: "Vui lòng chọn loại giảm giá" },
              ]}
            >
              <Select size="large" options={couponTypeOptions} />
            </Form.Item>

            <Form.Item
              label="Giá trị giảm"
              name="value"
              rules={[
                { required: true, message: "Vui lòng nhập giá trị giảm" },
                {
                  type: "number",
                  min: couponType === "PERCENTAGE" ? 1 : 1,
                  max: couponType === "PERCENTAGE" ? 100 : undefined,
                  message:
                    couponType === "PERCENTAGE"
                      ? "Giá trị phải từ 1 đến 100"
                      : "Giá trị phải lớn hơn 0",
                },
              ]}
            >
              <InputNumber
                size="large"
                className="w-full!"
                min={couponType === "PERCENTAGE" ? 1 : 1}
                max={couponType === "PERCENTAGE" ? 100 : undefined}
                placeholder={couponType === "PERCENTAGE" ? "1-100" : "Số tiền"}
                addonAfter={couponType === "PERCENTAGE" ? "%" : "đ"}
              />
            </Form.Item>

            <Form.Item
              label="Giá trị đơn hàng tối thiểu"
              name="minOrderAmount"
              tooltip="Số tiền tối thiểu của đơn hàng để áp dụng mã"
            >
              <InputNumber
                size="large"
                className="w-full!"
                min={0}
                placeholder="0"
                addonAfter="đ"
              />
            </Form.Item>

            <Form.Item
              label="Số tiền giảm tối đa"
              name="maxDiscountAmount"
              tooltip="Chỉ áp dụng khi loại giảm là phần trăm (tùy chọn)"
            >
              <InputNumber
                size="large"
                className="w-full!"
                min={0}
                placeholder="Không giới hạn"
                addonAfter="đ"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Giới hạn số lần sử dụng"
            name="usageLimit"
            tooltip="Để trống nếu muốn không giới hạn"
          >
            <InputNumber
              size="large"
              className="w-full!"
              min={0}
              placeholder="Không giới hạn"
            />
          </Form.Item>

          <Form.Item
            label="Cho phép sử dụng nhiều lần"
            name="allowMultipleUsePerUser"
            valuePropName="checked"
            tooltip="Nếu bật, cùng một user có thể sử dụng coupon này nhiều lần. Nếu tắt, mỗi user chỉ được sử dụng một lần."
          >
            <Switch
              checkedChildren="Bật"
              unCheckedChildren="Tắt"
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Ngày bắt đầu hiệu lực"
              name="validFrom"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              ]}
            >
              <DatePicker
                size="large"
                className="w-full!"
                format="DD/MM/YYYY HH:mm"
                showTime
                placeholder="Chọn ngày giờ bắt đầu"
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              label="Ngày kết thúc hiệu lực"
              name="validTo"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc" },
              ]}
            >
              <DatePicker
                size="large"
                className="w-full!"
                format="DD/MM/YYYY HH:mm"
                showTime
                placeholder="Chọn ngày giờ kết thúc"
                disabledDate={(current) => {
                  const validFrom = form.getFieldValue("validFrom");
                  return current && validFrom && current < validFrom;
                }}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select size="large" options={statusOptions} />
          </Form.Item>

          <Form.Item className="mt-6 pt-6! border-t border-gray-200">
            <Space>
              <Button
                type="default"
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/coupons")}
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

export default CouponFormPage;
