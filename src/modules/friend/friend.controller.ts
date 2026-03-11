import { Response, NextFunction } from 'express';
import { FriendService } from './friend.service';
import { IRequest } from '../../shared/types/request.types';
import { StatusCodes } from '../../shared/constants/status-codes';

export class FriendController {
  private friendService: FriendService;

  constructor() {
    this.friendService = new FriendService();
  }

  sendRequest = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.friendService.sendFriendRequest(req.user!.userId, req.body);

      res.status(StatusCodes.CREATED).json({
        success: true,
        statusCode: StatusCodes.CREATED,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  acceptRequest = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.friendService.acceptFriendRequest(req.user!.userId, req.params.id);

      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  rejectRequest = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.friendService.rejectFriendRequest(req.user!.userId, req.params.id);

      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  getFriends = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.friendService.getFriends(req.user!.userId);

      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        data: result.friends,
      });
    } catch (error) {
      next(error);
    }
  };

  getPendingRequests = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.friendService.getPendingRequests(req.user!.userId);

      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        data: result.requests,
      });
    } catch (error) {
      next(error);
    }
  };
}
