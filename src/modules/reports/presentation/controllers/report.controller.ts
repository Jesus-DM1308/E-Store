import { Request, Response } from 'express';
import { GetSalesReport } from '../../../reports/application/index.js';



export class ReportController {

  constructor(
    private readonly getSalesReportUseCase: GetSalesReport
  ) {}


  public getSalesReport = async ( req: Request, res: Response ) => {
    
    const { startDate, endDate } = req.query;

    // se saca el id del tojen
    const sellerId = (req as any).userTokenData?.id;

  
    const report = await this.getSalesReportUseCase.execute( 
      startDate as string, 
      endDate as string, 
      sellerId 
    )

    res.status(200).json( report );

  };



}