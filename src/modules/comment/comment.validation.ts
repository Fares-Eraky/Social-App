import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(1000, 'Content must not exceed 1000 characters'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
