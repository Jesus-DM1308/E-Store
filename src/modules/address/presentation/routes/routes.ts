import { Router } from 'express';
import { addressController } from '../dependencies/dependencies.js';
import { catchAsync } from '../../../../shared/infrastructure/index.js';
import { AuthMiddleware } from '../../../../shared/presentation/middlewares/auth.middleware.js';

export class AddressRoutes {

    constructor() {}

    static get routes(): Router {
        const router = Router();

        router.get('/', catchAsync(AuthMiddleware.validateJWT), catchAsync(addressController.getAll));
        router.get('/:id', catchAsync(AuthMiddleware.validateJWT), catchAsync(addressController.getAddress));

        router.post('/create', catchAsync(AuthMiddleware.validateJWT), catchAsync(addressController.createAddress));
        router.put('/update/:id', catchAsync(AuthMiddleware.validateJWT), catchAsync(addressController.updateAddress));
        router.delete('/delete/:id', catchAsync(AuthMiddleware.validateJWT), catchAsync(addressController.deleteAddress));

        return router;
    }
}
