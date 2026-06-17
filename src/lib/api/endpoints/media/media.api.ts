import { apiClient } from "../../api-client";
import type { UploadMediaResponse } from "./media.types";

export const uploadAdminMedia = async (file: File): Promise<UploadMediaResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<UploadMediaResponse>("/admin/media/upload", {
    method: "POST",
    body: formData,
  });
};

export const uploadAdminImage = async (file: File): Promise<UploadMediaResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<UploadMediaResponse>("/admin/media/upload/image", {
    method: "POST",
    body: formData,
  });
};

export const deleteAdminMedia = async (id: string): Promise<void> => {
  await apiClient<void>(`/admin/media/${id}`, {
    method: "DELETE",
  });
};
