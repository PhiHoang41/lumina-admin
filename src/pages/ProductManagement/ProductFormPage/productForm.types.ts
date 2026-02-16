import type { UploadFile } from "antd";

export interface Color {
  name: string;
  hex: string;
}

export interface ProductVariant {
  size: string;
  color: Color;
  price: number;
  stock: number;
  images?: string[];
  isActive?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  totalStock: number;
  isActive: boolean;
  images: string[];
  variants: ProductVariant[];
}

export interface UseImageUploadReturn {
  imageUrls: string[];
  fileList: UploadFile[];
  isUploading: boolean;
  handleUpload: (file: File) => Promise<boolean>;
  handleRemoveImage: (url: string) => void;
  setFileList: (fileList: UploadFile[]) => void;
}
