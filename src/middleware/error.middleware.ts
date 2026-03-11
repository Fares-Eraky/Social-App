import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppException } from '../utils/exception.class';
import { StatusCodes } from '../shared/constants/status-codes';

export const errorHandler = (
  error: Error | AppException | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ZodError) {
    const errors = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Validation error',
      errors,
    });
    return;
  }

  if (error instanceof AppException) {
    res.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      message: error.message,
    });
    return;
  }

  console.error('Unhandled error:', error);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message || 'Something went wrong',
  });
};
