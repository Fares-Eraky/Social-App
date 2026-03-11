import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  chatId: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  readBy: Schema.Types.ObjectId[];
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    fileUrl: {
      type: String,
    },
    readBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ chatId: 1, createdAt: -1 });

export const Message = model<IMessage>('Message', messageSchema);
