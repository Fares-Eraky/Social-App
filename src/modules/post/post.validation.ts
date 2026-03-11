import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(5000, 'Content must not exceed 5000 characters'),
  visibility: z.enum(['public', 'friends', 'private']).optional().default('public'),
});

export const updatePostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(5000, 'Content must not exceed 5000 characters').optional(),
  visibility: z.enum(['public', 'friends', 'private']).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
