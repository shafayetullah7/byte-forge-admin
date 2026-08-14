import { createSignal } from "solid-js";
import { deleteAdminMedia, uploadAdminImage } from "~/lib/api/endpoints/media";
import { ApiError } from "~/lib/api/types";
import { prepareImageForUpload } from "~/lib/media/prepare-image-for-upload";

export interface UseImageUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  compressBeforeUpload?: boolean;
  onSuccess?: (mediaId: string, mediaUrl: string) => void;
  onError?: (error: Error) => void;
}

export interface UseImageUploadReturn {
  isUploading: () => boolean;
  isDeleting: () => boolean;
  preview: () => string | null;
  mediaId: () => string | null;
  uploadError: () => string | null;
  upload: (file: File) => Promise<void>;
  deleteMedia: () => Promise<void>;
  setExisting: (mediaId: string | null, previewUrl: string | null) => void;
  clear: () => void;
}

export function useImageUpload(
  options: UseImageUploadOptions = {},
): UseImageUploadReturn {
  const {
    maxSizeMB = 3,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
    compressBeforeUpload = true,
    onSuccess,
    onError,
  } = options;

  const [isUploading, setIsUploading] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [preview, setPreview] = createSignal<string | null>(null);
  const [mediaId, setMediaId] = createSignal<string | null>(null);
  const [uploadError, setUploadError] = createSignal<string | null>(null);

  const upload = async (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      const error = new Error(
        `Only ${allowedTypes.map((t) => t.split("/")[1]?.toUpperCase()).join(", ")} images are allowed`,
      );
      setUploadError(error.message);
      onError?.(error);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    const oldMediaId = mediaId();

    try {
      const uploadFile = await prepareImageForUpload(file, {
        maxSizeMB,
        enabled: compressBeforeUpload,
      });

      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (uploadFile.size > maxSizeBytes) {
        throw new Error(`File size must be less than ${maxSizeMB}MB`);
      }

      const response = await uploadAdminImage(uploadFile);
      setMediaId(response.id);
      setPreview(response.url);
      onSuccess?.(response.id, response.url);

      if (oldMediaId && oldMediaId !== response.id) {
        deleteAdminMedia(oldMediaId).catch(() => {});
      }
    } catch (error: unknown) {
      const err =
        error instanceof ApiError
          ? new Error(error.message)
          : error instanceof Error
            ? error
            : new Error("Failed to upload image");
      setUploadError(err.message);
      onError?.(err);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteMedia = async () => {
    const currentMediaId = mediaId();
    if (!currentMediaId) return;

    setIsDeleting(true);
    setUploadError(null);

    try {
      await deleteAdminMedia(currentMediaId);
      setMediaId(null);
      setPreview(null);
    } catch (error: unknown) {
      const err =
        error instanceof ApiError
          ? new Error(error.message)
          : error instanceof Error
            ? error
            : new Error("Failed to delete image");
      setUploadError(err.message);
      onError?.(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const setExisting = (id: string | null, previewUrl: string | null) => {
    setMediaId(id);
    setPreview(previewUrl);
  };

  const clear = () => {
    setPreview(null);
    setMediaId(null);
    setUploadError(null);
  };

  return {
    isUploading,
    isDeleting,
    preview,
    mediaId,
    uploadError,
    upload,
    deleteMedia,
    setExisting,
    clear,
  };
}
