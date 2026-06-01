import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../../../config/jwt.adapter.js';
import { CustomError } from '../../../../shared/domain/errors/custom-error.js';





export class AuthMiddleware {

  static validateJWT = async ( req: any, res: Response, next: NextFunction ) => {
    const authorization = req.header('Authorization');
    
    if ( !authorization ) {
      throw CustomError.unauthorized('No token provided');
    }           //return res.status(401).json({ error: 'No token provided' });

    if ( !authorization.startsWith('Bearer ') ) {
      throw CustomError.unauthorized('Invalid Bearer token');
    }           //return res.status(401).json({ error: 'Invalid Bearer token' });

    const token = authorization.split(' ').pop() || '';

    try {
      const payload = await JwtAdapter.validateToken<{ id: string, role: string }>(token);
      if ( !payload ) {
        throw CustomError.unauthorized('Invalid token');
      }               //return res.status(401).json({ error: 'Invalid token' });
      
     
      req.userTokenData = payload; 

      next();
    } catch (error) {
      throw CustomError.internalServer();
      //res.status(500).json({ error: 'Internal Server Error' });
     
    }
  }

}