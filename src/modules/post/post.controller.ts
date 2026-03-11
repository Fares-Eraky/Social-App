import { Response, NextFunction } from 'express';
import { PostService } from './post.service';
import { IRequest } from '../../shared/types/request.types';
import { StatusCodes } from '../../shared/constants/status-codes';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  createPost = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      const post = await this.postService.createPost(req.user!.userId, req.body, files);
      
      res.status(StatusCodes.CREATED).json({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Post created successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  };

  getPosts = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await this.postService.getPosts(req.user!.userId, page, limit);
      
      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        data: result.posts,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  likePost = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.postService.likeUnlikePost(req.user!.userId, req.params.id);
      
      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.postService.deletePost(req.user!.userId, req.params.id);
      
      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  getPost = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.postService.getPostById(req.params.id);
      
      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  };
}
