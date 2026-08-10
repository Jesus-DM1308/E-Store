import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../../config/jwt.adapter.js';
import { CustomError } from '../../domain/errors/custom-error.js';

export class AuthMiddleware {
  static validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header(`Authorization`);

    if (!authorization) {
      throw CustomError.unauthorized(`No token provided`);
    }

    if (!authorization.startsWith(`Bearer `)) {
      throw CustomError.unauthorized(`Invalid Bearer token`);
    }

    const token = authorization.split(` `).pop() || ``;
    const payload = await JwtAdapter.validateToken<{
      id: string;
      role: string;
    }>(token);
    if (!payload) {
      throw CustomError.unauthorized(`Invalid token`);
    }
    req.userTokenData = payload;

    next();
  };

  static validateRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.userTokenData;
      if (!user) {
        throw CustomError.unauthorized(`User not authenticated`);
      }
      if (!roles.includes(user.role)) {
        throw CustomError.forbidden(
          `You dont have permissions to access this route`,
        );
      }
      next();
    };
  };
}
