import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../../storage/storage.service';

const storageService = new StorageService();

export interface IPost extends Document {
  userId: Schema.Types.ObjectId;
  content: string;
  assets: string[];
  assetFolderId: string;
  likes: Schema.Types.ObjectId[];
  likesCount: number;
  commentsCount: number;
  visibility: 'public' | 'friends' | 'private';
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    assets: {
      type: [String],
      default: [],
    },
    assetFolderId: {
      type: String,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public',
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre('save', function () {
  if (!this.assetFolderId) {
    this.assetFolderId = `posts/${this.userId}/${uuidv4()}`;
  }
});

postSchema.post('deleteOne', { document: true, query: false }, async function (this: IPost) {
  if (this.assets && this.assets.length > 0) {
    try {
      await storageService.deleteFiles(this.assets);
    } catch (error) {
      console.error('Error deleting post assets:', error);
    }
  }

  try {
    const Comment = model('Comment');
    await Comment.deleteMany({ postId: this._id });
  } catch (error) {
    console.error('Error deleting post comments:', error);
  }
});

export const Post = model<IPost>('Post', postSchema);
