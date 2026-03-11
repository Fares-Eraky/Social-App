import { Schema, model, Document } from 'mongoose';

export interface IChat extends Document {
  type: 'one-on-one' | 'group';
  participants: Schema.Types.ObjectId[];
  groupName?: string;
  groupAdmin?: Schema.Types.ObjectId;
  lastMessage?: Schema.Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    type: {
      type: String,
      enum: ['one-on-one', 'group'],
      required: true,
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },
    groupName: {
      type: String,
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = model<IChat>('Chat', chatSchema);
