import { CommentRepository } from './comment.repository';
import { CreateCommentInput } from './comment.validation';
import { PostRepository } from '../post/post.repository';
import { AppException } from '../../utils/exception.class';
import { StatusCodes } from '../../shared/constants/status-codes';

export class CommentService {
  private commentRepository: CommentRepository;
  private postRepository: PostRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
    this.postRepository = new PostRepository();
  }

  async createComment(userId: string, postId: string, data: CreateCommentInput) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new AppException(StatusCodes.NOT_FOUND, 'Post not found');
    }

    const comment = await this.commentRepository.create({
      postId: postId as any,
      userId: userId as any,
      content: data.content,
    });

    post.commentsCount += 1;
    await post.save();

    await comment.populate('userId', 'username profilePicture');
    return comment;
  }

  async getComments(postId: string, page: number = 1, limit: number = 20) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new AppException(StatusCodes.NOT_FOUND, 'Post not found');
    }

    return await this.commentRepository.getPaginatedComments(postId, page, limit);
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new AppException(StatusCodes.NOT_FOUND, 'Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new AppException(StatusCodes.FORBIDDEN, 'You can only delete your own comments');
    }

    const post = await this.postRepository.findById(comment.postId.toString());
    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await post.save();
    }

    await this.commentRepository.delete(commentId);

    return { message: 'Comment deleted successfully' };
  }
}
