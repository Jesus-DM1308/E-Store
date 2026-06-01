import { Router } from 'express';
import { UserDatasourceImpl, UserRepositoryImpl } from '../../infrastructure/index.js';
import { AuthMiddleware, UsersController } from '../index.js';
import { catchAsync } from '../../../../shared/infrastructure/http/utils/catch-async.js';


export class UsersRoutes {

  static get routes(): Router {

    const router = Router();

    const datasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl( datasource );
    const userController = new UsersController( userRepository );


    // router.get('/', 
    //   catchAsync(userController.getUsers) 
    // );

    router.get('/:id', 
      catchAsync(AuthMiddleware.validateJWT),
      catchAsync(userController.getUserById) 
    );
    
    // creacion(registro)
    router.post('/', catchAsync(userController.registerUser) );

    // login
    router.post('/login', catchAsync(userController.loginUser) );

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
  }

}