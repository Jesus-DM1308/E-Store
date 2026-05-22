import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller.js';
import { catchAsync } from '../../../../shared/infrastructure/index.js';

export class ProductsRoutes {
  constructor(){};

  static get routes(): Router {

    const router = Router();
    const controller = new ProductsController();

    router.get('/', catchAsync( controller.getAll() ) );
    router.get('/:id', catchAsync( controller.getById() ) );
    router.post('/', catchAsync( controller.create() ) );
    router.put('/:id', catchAsync( controller.updateById() ) );
    router.delete('/:id', catchAsync( controller.deleteById() ) );

    return router;
  };
};