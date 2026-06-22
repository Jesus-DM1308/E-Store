import { Router } from 'express';
import { AddressController } from '../dependencies/dependencies.js';
import { catchAsync } from '../../../../shared/infrastructure/index.js';

export class AddressRoutes {

    constructor() {}

    static get routes(): Router {
        const router = Router();

        router.get('/list/:id', AddressController.getAll);
        router.post('/create', catchAsync(AddressController.createAddress));
        router.put('/update/:id', AddressController.updateAddress);
        router.delete('/delete/:id', AddressController.deleteAddress);

        return router;
    }
}
