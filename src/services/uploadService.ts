export interface UploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  created_at: string;
}

export const uploadImage = async (
  file: File,
  folder: string = "categories",
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );
    formData.append("folder", folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Upload failed");
    }

    const data = await response.json();

    return {
      public_id: data.public_id,
      secure_url: data.secure_url,
      url: data.url,
      created_at: data.created_at,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to upload image");
  }
};

export default { uploadImage };
