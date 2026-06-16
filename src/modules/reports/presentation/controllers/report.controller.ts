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
  


  public getSalesReportPdf = async ( req: Request, res: Response ) => {
    
    const { startDate, endDate } = req.query;
    // se saca el id del tojen
    const sellerId = (req as any).userTokenData?.id;

    const report = await this.getSalesReportUseCase.execute(
      startDate as string,
      endDate as string,
      sellerId
    );

    // generar el PDF
    const pdfBuffer = await import('../../infrastructure/services/pdf.service.js')
      .then( module => module.PdfService.generateSalesReport( report ) );

    
    // enviar el PDF al cliente
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="sales_report${sellerId}.pdf`);
    res.status(200).send( pdfBuffer )


  }



}