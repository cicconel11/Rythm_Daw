import { z } from 'zod';

// Registration credentials schema
export const registrationCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(32, 'Display name must be no more than 32 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Display name can only contain letters, numbers, spaces, hyphens, and underscores'),
});

export type RegistrationCredentials = z.infer<typeof registrationCredentialsSchema>;

// Validation helper functions
export const validateRegistrationCredentials = (data: unknown): RegistrationCredentials => {
  return registrationCredentialsSchema.parse(data);
};

export const validateRegistrationCredentialsSafe = (data: unknown) => {
  return registrationCredentialsSchema.safeParse(data);
};
