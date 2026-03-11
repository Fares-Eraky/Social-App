export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  statusCode: number;
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
