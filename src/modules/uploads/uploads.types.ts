export interface UploadResponse {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width?: number | null;
  height?: number | null;
  bytes: number;
  folder?: string | null;
  uploadedById: string;
  createdAt: Date;
}

export interface CreateUploadInput {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  folder?: string;
  uploadedById: string;
}

export interface UploadQueryFilters {
  folder?: string;
  uploadedById?: string;
}
