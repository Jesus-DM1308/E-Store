import { SalesReportEntity } from "../index.js";

export abstract class ReportDatasource {
  abstract getSalesReport( startDate: Date, endDate: Date, sellerId: string ): Promise<SalesReportEntity>;
}