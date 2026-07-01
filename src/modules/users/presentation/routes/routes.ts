import { Router } from 'express';
import { UserDatasourceImpl, UserRepositoryImpl } from '../../infrastructure/index.js';
import { AuthMiddleware, UsersController } from '../index.js';
import { catchAsync } from '../../../../shared/infrastructure/http/utils/catch-async.js';

import { DrizzleOrderDatasource, OrderRepositoryImpl } from '../../../orders/infrastructure/index.js';


export class UsersRoutes {

  static get routes(): Router {

    const router = Router();

    // users
    const datasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl( datasource );

    // orders
    const orderDatasource = new DrizzleOrderDatasource();
    const orderRepository = new OrderRepositoryImpl(orderDatasource);

    const userController = new UsersController( userRepository, orderRepository );

    const admin = 'ADMIN';

    // login
    router.post('/login', catchAsync(userController.loginUser) );
    
    // creacion(registro)
    router.post('/', catchAsync(userController.registerUser) );
    
    router.get('/',
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(AuthMiddleware.validateRoles(admin)),
      catchAsync(userController.getUsers) 
    );

    router.get('/:id', 
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(userController.getUserById) 
    );

    // modificacion
    router.put('/:id', 
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(userController.updateUser) 
    );

    router.delete('/:id', 
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(userController.deleteUser) 
    ); 
        
    return router;
  };
};