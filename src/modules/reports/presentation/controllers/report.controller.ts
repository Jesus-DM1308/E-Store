import { Request, Response } from 'express';
import { GetSalesReport } from '../../../reports/application/index.js';
import { PdfService } from '../../infrastructure/services/pdf.service.js'; // 🛠️ REFACTOR: Importación limpia arriba



export class ReportController {


  constructor(
    private readonly getSalesReportUseCase: GetSalesReport
  ) {}


  // metodo para obteber los parametros del reporte
  private getReportParams(req: Request) {
    const { startDate, endDate } = req.query;
    const sellerId = (req as any).userTokenData?.id;
    
    return {
      startDate: startDate as string,
      endDate: endDate as string,
      sellerId
    }
  }

  public getSalesReport = async ( req: Request, res: Response ) => {

    // obtener los parametros del reporte
    const { startDate, endDate, sellerId } = this.getReportParams(req);

    const report = await this.getSalesReportUseCase.execute(startDate, endDate, sellerId);

    res.status(200).json(report);

  }

  public getSalesReportPdf = async ( req: Request, res: Response ) => {
    
    const { startDate, endDate, sellerId } = this.getReportParams(req);

    const report = await this.getSalesReportUseCase.execute(startDate, endDate, sellerId);

    // generar el PDF del reporte
    const pdfBuffer = await PdfService.generateSalesReport(report);

    // enviar el PDF al cliente
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="sales_report_${sellerId}.pdf"`);
    
    res.status(200).send(pdfBuffer);

  }


}