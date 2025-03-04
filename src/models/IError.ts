export interface IError {
  message: string;
  status: string;
  details?: unknown;
  code?: string;
}