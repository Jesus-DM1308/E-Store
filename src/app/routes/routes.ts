import { Router } from 'express';
import { ProductsRoutes } from '../../modules/products/presentation/index.ts';

export class AppRoutes {

  static get routes(): Router {

    const router = Router();
    
    router.use('/products', ProductsRoutes.routes );

    return router;
  };
};