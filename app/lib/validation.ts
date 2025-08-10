import { z } from 'zod';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

// Configure zxcvbn options
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  useLevenshteinDistance: true,
  translations: zxcvbnEnPackage.translations,
};

zxcvbnOptions.setOptions(options);

// Email validation (RFC 5322 compliant)
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(5, 'Email is too short')
  .max(320, 'Email is too long');

// 6-digit code validation
export const codeSchema = z.string()
  .length(6, 'Code must be exactly 6 digits')
  .regex(/^\d+$/, 'Code must contain only digits');

// Display name validation
export const displayNameSchema = z.string()
  .min(2, 'Display name must be at least 2 characters')
  .max(40, 'Display name must be at most 40 characters')
  .trim();

// Password validation with zxcvbn
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .superRefine((val, ctx) => {
    const result = zxcvbn(val);
    if (result.score < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.feedback.warning || 'Password is too weak',
      });
    }
  });

// Avatar URL validation (optional)
export const avatarUrlSchema = z.string().url('Invalid URL').or(z.literal('')).nullable();

// API request schemas
export const initRequestSchema = z.object({
  email: emailSchema,
});

export const verifyRequestSchema = z.object({
  email: emailSchema,
  requestId: z.string().uuid('Invalid request ID'),
  code: codeSchema,
});

export const completeRequestSchema = z.object({
  token: z.string().uuid('Invalid token'),
  displayName: displayNameSchema,
  password: passwordSchema,
  avatarUrl: avatarUrlSchema,
});

// Type exports
export type InitRequest = z.infer<typeof initRequestSchema>;
export type VerifyRequest = z.infer<typeof verifyRequestSchema>;
export type CompleteRequest = z.infer<typeof completeRequestSchema>;

// Helper function to validate with custom error formatting
export function validateWithSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map(e => e.message).join(', '),
    };
  }
  return { success: true, data: result.data };
}
