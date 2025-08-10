import { z } from 'zod';

export const eventBaseSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  subcategoryId: z.string().uuid().optional().nullable(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  allDay: z.boolean().default(false),
  location: z.string().optional(),
});

export const createEventSchema = eventBaseSchema.superRefine((data, ctx) => {
  if (data.endsAt < data.startsAt) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '종료시간은 시작시간 이후여야 합니다',
      path: ['endsAt'],
    });
  }
});

export const updateEventSchema = eventBaseSchema.partial();
