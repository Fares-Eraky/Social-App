import { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = model<IComment>('Comment', commentSchema);
