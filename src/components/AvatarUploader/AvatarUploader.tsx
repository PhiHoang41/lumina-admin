import { useState } from "react";
import { Upload, message, Button, Spin } from "antd";
import { PlusOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { uploadImage } from "../../services/uploadService";

interface AvatarUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const AvatarUploader = ({ value, onChange }: AvatarUploaderProps) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const response = await uploadImage(file, "avatars");
      onChange?.(response.secure_url);
      message.success("Upload ảnh thành công!");
    } catch (error) {
      message.error("Upload ảnh thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = () => {
    onChange?.("");
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Chọn ảnh</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <Upload
        name="avatar"
        listType="picture-circle"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleChange}
        accept="image/*"
        disabled={loading}
      >
        {loading ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        ) : value ? (
          <img
            src={value}
            alt="avatar"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
      {value && !loading && (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={handleRemove}
          className="mt-2"
        >
          Xóa ảnh
        </Button>
      )}
    </div>
  );
};
