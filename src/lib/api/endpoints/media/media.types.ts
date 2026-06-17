export interface Media {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  usedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UploadMediaResponse = Media;
