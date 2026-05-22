import { Router } from 'express';
import { UserDatasourceImpl, UserRepositoryImpl } from '../../infrastructure/index.js';
import { UsersController } from '../index.js';
import { catchAsync } from '../../../../shared/infrastructure/http/utils/catch-async.js';


export class UsersRoutes {

  static get routes(): Router {

    const router = Router();

    const datasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl( datasource );
    const userController = new UsersController( userRepository );

    router.get('/', catchAsync(userController.getUsers) );
    router.get('/:id', catchAsync(userController.getUserById) );
    
    router.post('/', catchAsync(userController.registerUser) );
    router.put('/:id', catchAsync(userController.updateUser) );
    router.delete('/:id', catchAsync(userController.deleteUser) );

    
    return router;
  }

}