import { Router } from 'express';
import { ProductsRoutes } from '../../modules/products/presentation/index.ts';
import { UsersRoutes } from '../../modules/users/presentation/index.ts';

export class AppRoutes {

  static get routes(): Router {

    const router = Router();
    
    router.use('/products', ProductsRoutes.routes );
    router.use('/users', UsersRoutes.routes );
    
    return router;
  };
};