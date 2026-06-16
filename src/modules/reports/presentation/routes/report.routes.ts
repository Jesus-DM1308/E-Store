import { Router } from 'express';
import { ReportDatasourceImpl, ReportRepositoryImpl } from '../../infrastructure/index.js';
import { GetSalesReport } from '../../application/index.js';
import { AuthMiddleware } from '../../../users/presentation/index.js';
import { catchAsync } from '../../../../shared/infrastructure/index.js';
import { ReportController } from '../index.js';




export class ReportRoutes {

  static routes( db: any ): Router {


    const router = Router();
    
    const sellerRole = 'SELLER';


    const datasource = new ReportDatasourceImpl( db );
    const repository = new ReportRepositoryImpl( datasource );
    const useCase = new GetSalesReport( repository );
    const controller = new ReportController( useCase );



    router.get('/',
      catchAsync( AuthMiddleware.validateJWT ),
      catchAsync( AuthMiddleware.validateRoles( sellerRole ) ),
      catchAsync( controller.getSalesReport )
    );

    router.get('/sales-pdf',
      catchAsync( AuthMiddleware.validateJWT ),
      catchAsync( AuthMiddleware.validateRoles( sellerRole ) ),
      catchAsync( controller.getSalesReportPdf )
    );
    

    return router;

  }
}