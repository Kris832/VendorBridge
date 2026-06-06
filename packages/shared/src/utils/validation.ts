import { z } from 'zod';

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain uppercase, lowercase, number, and special character');
export const phoneSchema = z.string().regex(/^[\d\-\+\s\(\)]+$/);
export const gstSchema = z.string().regex(/^[0-9A-Z]{15}$/);
export const panSchema = z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

export const createVendorSchema = z.object({
  name: z.string().min(2),
  email: emailSchema,
  phone: phoneSchema,
  website: z.string().url().optional(),
  gstNumber: gstSchema,
  panNumber: panSchema,
  category: z.string().min(2),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().regex(/^[0-9]{5,6}$/),
  country: z.string().min(2),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).default('ASC'),
});
