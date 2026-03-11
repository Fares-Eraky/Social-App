import { PostRepository } from './post.repository';
import { CreatePostInput } from './post.validation';
import { StorageService } from '../../storage/storage.service';
import { AppException } from '../../utils/exception.class';
import { StatusCodes } from '../../shared/constants/status-codes';

export class PostService {
  private postRepository: PostRepository;
  private storageService: StorageService;

  constructor() {
    this.postRepository = new PostRepository();
    this.storageService = new StorageService();
  }

  async createPost(userId: string, data: CreatePostInput, files?: Express.Multer.File[]) {
    const assetKeys: string[] = [];

    if (files && files.length > 0) {
      const assetFolder = `posts/${userId}`;

      for (const file of files) {
        const key = this.storageService.generateUniqueKey(assetFolder, file.originalname);
        
        if (file.size > 5 * 1024 * 1024) {
          await this.storageService.uploadLargeFile(file.buffer, key);
        } else {
          await this.storageService.uploadFile(file.buffer, key, file.mimetype);
        }
        
        assetKeys.push(key);
      }
    }

    const post = await this.postRepository.create({
      userId: userId as any,
      content: data.content,
      visibility: data.visibility || 'public',
      assets: assetKeys,
    });

    const populatedPost = await this.postRepository.findById(post._id.toString());
    await populatedPost?.populate('userId', 'username profilePicture');

    return populatedPost;
  }

  async getPosts(userId: string, page: number = 1, limit: number = 20) {
    const filter = {
      $or: [
        { visibility: 'public' },
        { userId, visibility: 'private' },
        { visibility: 'friends' },
      ],
    };

    return await this.postRepository.getPaginatedPosts(page, limit, filter);
  }

  async likeUnlikePost(userId: string, postId: string) {
    const post = await this.postRepository.toggleLike(postId, userId);
    
    if (!post) {
      throw new AppException(StatusCodes.NOT_FOUND, 'Post not found');
    }

    const isLiked = post.likes.some((id) => id.toString() === userId);

    return {
      message: isLiked ? 'Post liked' : 'Post unliked',
      likesCount: post.likesCount,
      isLiked,
    };
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.postRepository.findById(postId);
    
    if (!post) {
      throw new AppException(StatusCodes.NOT_FOUND, 'Post not found');
    }

    if (post.userId.toString() !== userId) {
      throw new AppException(StatusCodes.FORBIDDEN, 'You can only delete your own posts');
    }

    await post.deleteOne();

    return { message: 'Post deleted successfully' };
  }

  async getPostById(postId: string) {
    const post = await this.postRepository.findById(postId);
    
    if (!post) {
      throw new AppException(StatusCodes.NOT_FOUND, 'Post not found');
    }

    await post.populate('userId', 'username profilePicture');
    return post;
  }
}
