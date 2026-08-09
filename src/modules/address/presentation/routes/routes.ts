import { Router } from 'express';
import { addressController } from '../dependencies/dependencies.js';
import { catchAsync } from '../../../../shared/infrastructure/index.js';

export class AddressRoutes {

    constructor() {}

    static get routes(): Router {
        const router = Router();

        router.get('/list/:id', addressController.getAddress);
        router.post('/create', catchAsync(addressController.createAddress));
        router.put('/update/:id', addressController.updateAddress);
        router.delete('/delete/:id', addressController.deleteAddress);

        return router;
    }
}
