import { Router } from 'express';
import { productsController } from '../dependencies/dependencies.js';
import { catchAsync } from '../../../../shared/infrastructure/index.js';

export class ProductsRoutes {
  constructor(){};

  static get routes(): Router {

    const router = Router();

    router.get('/', catchAsync( productsController.getAll ) );
    router.get('/:id', catchAsync( productsController.getById ) );
    router.post('/', catchAsync( productsController.create ) );
    router.put('/:id', catchAsync( productsController.updateById ) );
    router.delete('/:id', catchAsync( productsController.deleteById ) );

    return router;
  };
};