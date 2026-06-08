import { Router } from 'express';
import { AddressController } from '../controllers/address.controller.js';

export class AddressRoutes{

    static get routes(): Router {

        const router = Router();
        
        router.get('/', AddressController.getAll ); // NOT IMPLEMENTED
        router.get('/:id', AddressController.getById ); // WORKING
        router.post('/', AddressController.create ); // NOT IMPLEMENTED
        router.put('/:id', AddressController.updateById ); // NOT IMPLEMENTED
        router.delete('/:id', AddressController.deleteById ); // NOT IMPLEMENTED

        return router;
    };
};