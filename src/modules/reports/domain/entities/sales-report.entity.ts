export class SalesReportEntity {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly sellerName: string,
    public readonly totalEarnings: number,
    public readonly successfulOrders: number,
    public readonly refundedOrders: number,
    public readonly averageTicket: number,
    public readonly topSellingProduct: string
  ) {}
}