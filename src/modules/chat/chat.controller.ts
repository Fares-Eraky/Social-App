import { Response, NextFunction } from 'express';
import { ChatService } from './chat.service';
import { IRequest } from '../../shared/types/request.types';
import { StatusCodes } from '../../shared/constants/status-codes';

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  getOrCreateChat = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chat = await this.chatService.getOrCreateChat(req.user!.userId, req.body);

      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  };

  sendMessage = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = await this.chatService.sendMessage(
        req.user!.userId,
        req.params.id,
        req.body
      );

      res.status(StatusCodes.CREATED).json({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Message sent successfully',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  };

  getMessages = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await this.chatService.getMessages(req.user!.userId, req.params.id, page, limit);

      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        data: result.messages,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  createGroup = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chat = await this.chatService.createGroupChat(req.user!.userId, req.body);

      res.status(StatusCodes.CREATED).json({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Group chat created successfully',
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  };

  sendGroupMessage = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = await this.chatService.sendGroupMessage(
        req.user!.userId,
        req.params.id,
        req.body
      );

      res.status(StatusCodes.CREATED).json({
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Group message sent successfully',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserChats = async (req: IRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.chatService.getUserChats(req.user!.userId);

      res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        data: result.chats,
      });
    } catch (error) {
      next(error);
    }
  };
}
