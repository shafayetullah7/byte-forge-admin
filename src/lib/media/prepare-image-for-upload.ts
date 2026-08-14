import imageCompression from "browser-image-compression";

const MAX_EDGE_PX = 2048;
const COMPRESSION_TARGET_MB = 1.5;

const SKIP_COMPRESSION_TYPES = new Set(["image/gif", "image/svg+xml"]);

export function shouldCompressImage(mimeType: string): boolean {
  return mimeType.startsWith("image/") && !SKIP_COMPRESSION_TYPES.has(mimeType);
}

export async function prepareImageForUpload(
  file: File,
  options?: { maxSizeMB?: number; enabled?: boolean },
): Promise<File> {
  const maxSizeMB = options?.maxSizeMB ?? 3;
  const enabled = options?.enabled ?? true;

  if (!enabled || !shouldCompressImage(file.type)) {
    return file;
  }

  try {
    return await imageCompression(file, {
      maxSizeMB: Math.min(maxSizeMB, COMPRESSION_TARGET_MB),
      maxWidthOrHeight: MAX_EDGE_PX,
      useWebWorker: typeof Worker !== "undefined",
      initialQuality: 0.85,
      preserveExif: false,
    });
  } catch {
    return file;
  }
}
