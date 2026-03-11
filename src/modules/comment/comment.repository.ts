import { BaseRepository } from '../../shared/base.repository';
import { Comment, IComment } from './comment.model';

export class CommentRepository extends BaseRepository<IComment> {
  constructor() {
    super(Comment);
  }

  async getPaginatedComments(postId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const comments = await this.model
      .find({ postId })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.model.countDocuments({ postId });

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
