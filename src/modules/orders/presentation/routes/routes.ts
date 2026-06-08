import { Router } from "express";
import { catchAsync } from "../../../../shared/infrastructure/index.js";
import { AuthMiddleware } from "../../../../shared/presentation/middlewares/auth.middleware.js";
import { ordersController } from "../dependencies/dependencies.js";

export class OrdersRoutes {
    static get routes(): Router {
        const router = Router();

        const seller = 'SELLER';
        const admin = 'ADMIN';

        router.get('/',
            catchAsync(AuthMiddleware.validateJWT),
            catchAsync(AuthMiddleware.validateRoles(seller, admin)),
            catchAsync(ordersController.getAll)
        );

        router.get('/mine',
            catchAsync(AuthMiddleware.validateJWT),
            catchAsync(ordersController.getMine)
        );

        router.get('/:id',
            catchAsync(AuthMiddleware.validateJWT),
            catchAsync(ordersController.getById)
        );

        router.post('/',
            catchAsync(AuthMiddleware.validateJWT),
            catchAsync(ordersController.create)
        );

        router.patch('/:id/status',
            catchAsync(AuthMiddleware.validateJWT),
            catchAsync(AuthMiddleware.validateRoles(seller, admin)),
            catchAsync(ordersController.updateStatus)
        );

        router.delete('/:id',
            catchAsync(AuthMiddleware.validateJWT),
            catchAsync(AuthMiddleware.validateRoles(seller, admin)),
            catchAsync(ordersController.deleteById)
        );

        return router;
    };
}
