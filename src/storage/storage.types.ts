export interface UploadResult {
  key: string;
  location: string;
}

export interface PresignedUrlOptions {
  expiresIn?: number;
}
