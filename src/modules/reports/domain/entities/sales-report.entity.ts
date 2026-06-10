import { ReportOrderEntity } from "../index.js";

export class SalesReportEntity {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly totalEarnings: number,
    public readonly totalOrders: number,
    public readonly averageTicket: number,
    public readonly orders: ReportOrderEntity[]
  ) {}
}