import jwt from 'jsonwebtoken';
import { envs } from './envs.js';

export class JwtAdapter {

  
  private static readonly SEED = envs.JWT_SEED;

  
  static generateToken( payload: any, duration: string = '2h' ): Promise<string | null> {
    return new Promise((resolve) => {
      jwt.sign( payload, this.SEED, { expiresIn: duration as any}, (err, token) => {
        if ( err ) return resolve(null);
        resolve(token!);
      });
    });
  }

 
  static validateToken<T>( token: string ): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify( token, this.SEED, (err, decoded) => {
        if ( err ) return resolve(null);
        resolve(decoded as T);
      });
    });
  }

}