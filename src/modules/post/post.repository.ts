import { BaseRepository } from '../../shared/base.repository';
import { Post, IPost } from './post.model';

export class PostRepository extends BaseRepository<IPost> {
  constructor() {
    super(Post);
  }

  async getPaginatedPosts(page: number = 1, limit: number = 20, filter: any = {}) {
    const skip = (page - 1) * limit;

    const posts = await this.model
      .find(filter)
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.model.countDocuments(filter);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async toggleLike(postId: string, userId: string): Promise<IPost | null> {
    const post = await this.model.findById(postId);
    if (!post) return null;

    const userObjectId = userId as any;
    const likeIndex = post.likes.findIndex((id) => id.toString() === userId);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      post.likes.push(userObjectId);
      post.likesCount += 1;
    }

    await post.save();
    return post;
  }
}
