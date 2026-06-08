import { Router } from 'express';
import { ProductsRoutes } from '../../modules/products/presentation/index.js';
import { UsersRoutes } from '../../modules/users/presentation/index.js';
import { OrdersRoutes } from '../../modules/orders/presentation/index.js';

export class AppRoutes {

  static get routes(): Router {

    const router = Router();
    
    router.use('/products', ProductsRoutes.routes );
    router.use('/users', UsersRoutes.routes );
    router.use('/orders', OrdersRoutes.routes );
    
    return router;
  };
};
