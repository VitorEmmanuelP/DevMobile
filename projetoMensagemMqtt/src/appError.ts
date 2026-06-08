import { AppError } from './types';

export function appError(code: AppError['code'], message: string): Error & AppError {
  return Object.assign(new Error(message), { code }) as Error & AppError;
}
