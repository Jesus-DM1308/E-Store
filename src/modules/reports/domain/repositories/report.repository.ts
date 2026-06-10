import { SalesReportEntity } from "../entities/sales-report.entity.js";

export abstract class ReportRepository {
  
  abstract getSalesReport( startDate: Date, endDate: Date ): Promise<SalesReportEntity>;

}