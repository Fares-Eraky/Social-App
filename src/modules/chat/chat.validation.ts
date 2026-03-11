import { z } from 'zod';
import { generalFields } from '../../middleware/validation.middleware';

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  type: z.enum(['text', 'image', 'file']).optional().default('text'),
  fileUrl: z.string().url().optional(),
});

export const createGroupSchema = z.object({
  groupName: z.string().min(1, 'Group name is required').max(100, 'Group name must not exceed 100 characters'),
  participantIds: z.array(generalFields.objectId).min(2, 'At least 2 participants required'),
});

export const getOrCreateChatSchema = z.object({
  recipientId: generalFields.objectId,
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type GetOrCreateChatInput = z.infer<typeof getOrCreateChatSchema>;
