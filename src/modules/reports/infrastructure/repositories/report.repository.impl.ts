import { ReportDatasource, ReportRepository, SalesReportEntity } from "../../domain/index.js";


export class ReportRepositoryImpl implements ReportRepository {

  constructor(
    private readonly datasource: ReportDatasource
  ) {}

  async getSalesReport( startDate: Date, endDate: Date ): Promise<SalesReportEntity> {
    return await this.datasource.getSalesReport( startDate, endDate );
  }

}