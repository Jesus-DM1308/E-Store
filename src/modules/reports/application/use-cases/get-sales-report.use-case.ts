import { CustomError } from '../../../../shared/domain/errors/custom-error.js';
import { ReportRepository, SalesReportEntity } from '../../domain/index.js';

export interface GetSalesReportUseCase {
  execute(startDateStr: string, endDateStr: string): Promise<SalesReportEntity>;
}

export class GetSalesReport implements GetSalesReportUseCase {

  constructor(
    private readonly reportRepository: ReportRepository
  ) {}

  async execute(startDateStr: string, endDateStr: string): Promise<SalesReportEntity> {
    
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // validar que las fechas sean validas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw CustomError.badRequest('Las fechas no son validas ( AAAA-MM-DD)');
    }

    // fecha de inicio sea mayor a la de fin
    if (startDate > endDate) {
      throw CustomError.badRequest('La fecha de inicio no puede ser posterior a la fecha de fin');
    }

    return await this.reportRepository.getSalesReport(startDate, endDate);
  }

}