import { Router } from 'express';
import { catchAsync } from '../../../../shared/infrastructure/index.js';
import { AuthMiddleware } from '../../../../shared/presentation/middlewares/auth.middleware.js';
import { ordersController } from '../dependencies/dependencies.js';

export class OrdersRoutes {
  static get routes(): Router {
    const router = Router();

    const CLIENT = 'CLIENT';
    const SELLER = 'SELLER';

    router.get(
      '/',
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(AuthMiddleware.validateRoles(CLIENT)),
      catchAsync(ordersController.getAll),
    );

    router.get(
      '/seller',
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(AuthMiddleware.validateRoles(SELLER)),
      catchAsync(ordersController.getSellerOrders),
    );

    router.get(
      '/:id',
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(AuthMiddleware.validateRoles(CLIENT)),
      catchAsync(ordersController.getById),
    );

    router.post(
      '/',
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(AuthMiddleware.validateRoles(CLIENT)),
      catchAsync(ordersController.create),
    );

    router.patch(
      '/:id/status',
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(AuthMiddleware.validateRoles(CLIENT)),
      catchAsync(ordersController.updateStatus),
    );

    router.delete(
      '/:id',
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(AuthMiddleware.validateRoles(CLIENT)),
      catchAsync(ordersController.deleteById),
    );

    return router;
  }
}
