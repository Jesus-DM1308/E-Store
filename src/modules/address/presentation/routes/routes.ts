import { Router } from 'express';
import { addressController } from '../dependencies/dependencies.js';
import { catchAsync } from '../../../../shared/infrastructure/index.js';
import { AuthMiddleware } from '../../../users/presentation/index.js';

export class AddressRoutes {

    constructor() {}

    static get routes(): Router {
        const router = Router();
        router.post('/create', catchAsync(AuthMiddleware.validateJWT), catchAsync(addressController.createAddress));
        router.put('/update/:id', catchAsync(AuthMiddleware.validateJWT), catchAsync(addressController.updateAddress));
        router.delete('/delete/:id', catchAsync(AuthMiddleware.validateJWT), catchAsync(addressController.deleteAddress));

        return router;
    }
}
