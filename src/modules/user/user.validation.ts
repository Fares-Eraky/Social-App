import { z } from 'zod';
import { generalFields } from '../../middleware/validation.middleware';

export const signupSchema = z.object({
  email: generalFields.email,
  password: generalFields.password,
  username: generalFields.username,
});

export const loginSchema = z.object({
  email: generalFields.email,
  password: z.string().min(1, 'Password is required'),
});

export const confirmEmailSchema = z.object({
  email: generalFields.email,
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ConfirmEmailInput = z.infer<typeof confirmEmailSchema>;
