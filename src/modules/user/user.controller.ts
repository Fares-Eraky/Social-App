import { Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { IRequest } from '../../shared/types/request.types';
import { StatusCodes } from '../../shared/constants/status-codes';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  signup = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.userService.signup(req.body);
      res.status(StatusCodes.CREATED).json({
        success: true,
        statusCode: StatusCodes.CREATED,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  confirmEmail = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.userService.confirmEmail(req.body);
      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.userService.login(req.body);
      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1] || '';
      const result = await this.userService.logout(req.user!.userId, token);
      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.userService.getUserProfile(req.user!.userId);
      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
