import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../../config/jwt.adapter.js';
import { CustomError } from '../../domain/errors/custom-error.js';





export class AuthMiddleware {

  static validateJWT = async ( req: any, res: Response, next: NextFunction ) => {
    const authorization = req.header('Authorization');
    
    if ( !authorization ) {
      throw CustomError.unauthorized('No token provided');
    };

    if ( !authorization.startsWith('Bearer ') ) {
      throw CustomError.unauthorized('Invalid Bearer token');
    };

    const token = authorization.split(' ').pop() || '';
    const payload = await JwtAdapter.validateToken<{ id: string, role: string }>(token);
    if ( !payload ) {
      throw CustomError.unauthorized('Token invalido');
    };
    req.userTokenData = payload; 

    next();
  };
  static validateRoles = ( ...roles: string[] ) => {
    return (req: any, res: Response, next: NextFunction) => {
      const user = req.userTokenData;
      if( !user ){
        throw CustomError.unauthorized('Usuario no autenticado')
      };
      if( !roles.includes( user.role ) ){
        throw CustomError.forbidden('No tienes permisos para acceder a esta ruta');
      };
      next();
    };
  };
};
