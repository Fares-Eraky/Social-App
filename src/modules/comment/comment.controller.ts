import { Response, NextFunction } from 'express';
import { CommentService } from './comment.service';
import { IRequest } from '../../shared/types/request.types';
import { StatusCodes } from '../../shared/constants/status-codes';

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  createComment = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comment = await this.commentService.createComment(
        req.user!.userId,
        req.params.postId,
        req.body
      );

      res.status(StatusCodes.CREATED).json({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Comment created successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };

  getComments = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.commentService.getComments(req.params.postId, page, limit);

      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        data: result.comments,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteComment = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.commentService.deleteComment(req.user!.userId, req.params.id);

      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };
}
