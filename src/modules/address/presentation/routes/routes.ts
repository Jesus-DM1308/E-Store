import { Router } from 'express';
import { AddressController } from '../controllers/address.controller.js';

export class AddressRoutes {

    constructor() {}

    static get routes(): Router {
        const router = Router();

        router.get('/list', AddressController.getAddress);
        router.post('/create', AddressController.createAddress);
        router.put('/update', AddressController.updateAddress);
        router.delete('/delete', AddressController.deleteAddress);
        router.get('/test', AddressController.testAddress);

        return router;
    }
}
