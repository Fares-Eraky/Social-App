import { Response, NextFunction } from 'express';
import { IRequest } from '../shared/types/request.types';
import { verifyToken } from '../utils/jwt.util';
import { AppException } from '../utils/exception.class';
import { StatusCodes } from '../shared/constants/status-codes';
import { UserRepository } from '../modules/user/user.repository';

const userRepository = new UserRepository();

export const authenticate = async (
  req: IRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppException(StatusCodes.UNAUTHORIZED, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token);

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new AppException(StatusCodes.UNAUTHORIZED, 'User not found');
    }

    const userWithTokens = await userRepository.findByEmail(user.email);
    if (!userWithTokens?.tokens.includes(token)) {
      throw new AppException(StatusCodes.UNAUTHORIZED, 'Token has been revoked');
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      signatureLevel: decoded.signatureLevel,
    };

    next();
  } catch (error) {
    if (error instanceof AppException) {
      next(error);
    } else {
      next(new AppException(StatusCodes.UNAUTHORIZED, 'Invalid or expired token'));
    }
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: IRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AppException(StatusCodes.FORBIDDEN, 'Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireSignatureLevel = (minLevel: number) => {
  return (req: IRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppException(StatusCodes.UNAUTHORIZED, 'Authentication required');
      }

      if (req.user.signatureLevel < minLevel) {
        throw new AppException(
          StatusCodes.FORBIDDEN,
          `Signature level ${minLevel} or higher required`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
