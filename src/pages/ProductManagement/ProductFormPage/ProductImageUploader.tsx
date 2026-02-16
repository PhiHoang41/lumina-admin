import { Button, Upload, Image, Spin } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";

interface ProductImageUploaderProps {
  imageUrls: string[];
  fileList: UploadFile[];
  maxImages?: number;
  onUploadChange: UploadProps["onChange"];
  onRemoveImage: (url: string) => void;
}

export const ProductImageUploader = ({
  imageUrls,
  fileList,
  maxImages = 5,
  onUploadChange,
  onRemoveImage,
}: ProductImageUploaderProps) => {
  const uploadingFiles = fileList.filter(
    (file) => file.status === "uploading" && !file.url,
  );

  return (
    <div>
      {imageUrls.length > 0 && (
        <div className="space-y-3 mb-3">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-4">
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                width={100}
                height={100}
                className="rounded object-cover"
              />
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => onRemoveImage(url)}
              >
                Xóa ảnh
              </Button>
            </div>
          ))}
        </div>
      )}

      {uploadingFiles.length > 0 && (
        <div className="space-y-3 mb-3">
          {uploadingFiles.map((file) => {
            const preview = file.originFileObj
              ? URL.createObjectURL(file.originFileObj)
              : file.thumbUrl;

            return (
              <div
                key={file.uid}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded border border-gray-200"
              >
                <div className="relative">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Uploading preview"
                      className="w-[100px] h-[100px] rounded object-cover"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] rounded bg-gray-200 flex items-center justify-center">
                      <LoadingOutlined className="text-2xl text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded flex items-center justify-center">
                    <Spin
                      indicator={
                        <LoadingOutlined className="text-white text-2xl" spin />
                      }
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Đang tải lên...
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload button */}
      {fileList.length < maxImages && (
        <Upload
          fileList={fileList}
          onChange={onUploadChange}
          accept="image/*"
          multiple
          customRequest={() => {}}
          beforeUpload={() => false}
          showUploadList={false}
        >
          <Button
            icon={<PlusOutlined />}
            disabled={fileList.length >= maxImages}
          >
            Thêm ảnh
          </Button>
        </Upload>
      )}

      <div className="text-sm text-gray-500 mt-2">
        {imageUrls.length}/{maxImages} hình ảnh.
        {uploadingFiles.length > 0 && (
          <span className="ml-2 text-blue-500">
            ({uploadingFiles.length} đang tải lên)
          </span>
        )}
      </div>
    </div>
  );
};
