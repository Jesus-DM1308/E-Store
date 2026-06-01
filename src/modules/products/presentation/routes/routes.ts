import { Router } from 'express';
import { productsController } from '../dependencies/dependencies.js';
import { catchAsync } from '../../../../shared/infrastructure/index.js';
import { AuthMiddleware } from '../../../../shared/presentation/middlewares/auth.middleware.js';

export class ProductsRoutes {
  constructor(){};

  static get routes(): Router {

    const router = Router();

    const seller = 'SELLER';

    router.get('/', catchAsync( productsController.getAll ) );
    router.get('/:id', catchAsync( productsController.getById ) );

    router.post('/',
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(AuthMiddleware.validateRoles(seller)),
      catchAsync( productsController.create ) );

    router.put('/:id',
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(AuthMiddleware.validateRoles(seller)),
      catchAsync( productsController.updateById ) );

    router.delete('/:id',
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(AuthMiddleware.validateRoles(seller)),
      catchAsync( productsController.deleteById ) );

    return router;
  };
};