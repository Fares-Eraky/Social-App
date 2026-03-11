import { z } from 'zod';
import { generalFields } from '../../middleware/validation.middleware';

export const sendRequestSchema = z.object({
  receiverId: generalFields.objectId,
});

export type SendRequestInput = z.infer<typeof sendRequestSchema>;
