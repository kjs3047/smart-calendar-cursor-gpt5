import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1),
  colorHex: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const subcategorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1),
  colorHex: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/)
    .optional()
    .nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().nonnegative().default(0),
});
