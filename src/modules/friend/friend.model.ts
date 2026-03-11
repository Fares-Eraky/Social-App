import { Schema, model, Document } from 'mongoose';

export interface IFriendRequest extends Document {
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

friendRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

export const FriendRequest = model<IFriendRequest>('FriendRequest', friendRequestSchema);
