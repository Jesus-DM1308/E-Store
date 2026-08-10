import { SalesReportEntity } from "../../domain/index.js";



export class SalesReportMapper {

  static toReportEntity( object: { [key: string]: any } ): SalesReportEntity {
    
    
    const { 
      startDate, 
      endDate, 
      sellerName, 
      totalEarnings, 
      successfulOrders, 
      refundedOrders, 
      averageTicket, 
      topSellingProduct 
    } = object;

    
    return new SalesReportEntity(
      startDate,
      endDate,
      sellerName ?? 'Vendedor no encontrado',
      totalEarnings ?? 0,
      successfulOrders ?? 0,
      refundedOrders ?? 0,
      averageTicket ?? 0,
      topSellingProduct ?? 'Ninguno'
    );

  }


}