export interface ValidationResponse {
  isValid: boolean;
  match?: number[];
  isDone?: boolean;
  message?: string;
}
