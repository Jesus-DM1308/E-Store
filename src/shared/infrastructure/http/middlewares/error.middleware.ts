import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../../domain/errors/custom-error.js';

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (error instanceof CustomError) {

    return res.status(error.statusCode).json({
      error: error.message
    });
  }

  console.error(error);

  return res.status(500).json({
    error: 'Internal server error'
  });
};