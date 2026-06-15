import { and, gte, lte, sql, eq, desc } from 'drizzle-orm';
import { ReportDatasource, SalesReportEntity } from '../../domain/index.js';
import { orderDetailTable, orderTable, productsTable, usersTable } from '../../../../shared/infrastructure/index.js';
import { SalesReportMapper } from '../mappers/sales-report.mapper.js';



export class ReportDatasourceImpl implements ReportDatasource {

  constructor(private readonly db: any) {}

  async getSalesReport(startDate: Date, endDate: Date, sellerId: string): Promise<SalesReportEntity> {


    // inicio y fin de las fechasde todo el dia
    const startOfPeriod = new Date(startDate);
    startOfPeriod.setHours(0, 0, 0, 0);
    const endOfPeriod = new Date(endDate);
    endOfPeriod.setHours(23, 59, 59, 999);


    // ids del status en la basde de datos( en si podrian cambiar si se cambian los status)
    const STATUS_SUCCESSFUL = 5; 
    const STATUS_REFUNDED = 7;   

    
    // bsucar nombre dle vendedor
    const userResult = await this.db
      .select({ name: usersTable.name })
      .from(usersTable)
      .where(eq(usersTable.id, sellerId))
      .limit(1); 
    
    const sellerName = userResult[0]?.name ?? 'Vendedor no encontrado';

    
    // datos principales del reporte
    const [metrics] = await this.db
      .select({
        totalEarnings: sql`COALESCE(SUM(CASE WHEN ${orderTable.status} = ${STATUS_SUCCESSFUL} THEN ${orderTable.total} ELSE 0 END), 0)`.mapWith(Number),
        averageTicket: sql`COALESCE(AVG(CASE WHEN ${orderTable.status} = ${STATUS_SUCCESSFUL} THEN ${orderTable.total} ELSE NULL END), 0)`.mapWith(Number),
        successfulOrders: sql`COUNT(CASE WHEN ${orderTable.status} = ${STATUS_SUCCESSFUL} THEN 1 END)`.mapWith(Number),
        refundedOrders: sql`COUNT(CASE WHEN ${orderTable.status} = ${STATUS_REFUNDED} THEN 1 END)`.mapWith(Number)
      })
      .from(orderTable)
      .where(
        and(
          eq(orderTable.user_id, sellerId),
          gte(orderTable.created_at, startOfPeriod),
          lte(orderTable.created_at, endOfPeriod)
        )
      );

    
    // por default lo pongo como Ninguno
    let topSellingProduct = 'Ninguno';
    // buscar el producto mas vendido
    if (metrics.successfulOrders > 0) {
      try {
        const topProductResult = await this.db
          .select({ productName: productsTable.name })
          .from(orderDetailTable)
          .innerJoin(orderTable, eq(orderDetailTable.order_id, orderTable.id)) 
          .innerJoin(productsTable, eq(orderDetailTable.product_id, productsTable.id)) 
          .where(
            and(
              eq(orderTable.user_id, sellerId), 
              eq(orderTable.status, STATUS_SUCCESSFUL), 
              gte(orderTable.created_at, startOfPeriod),
              lte(orderTable.created_at, endOfPeriod)
            )
          )
          .groupBy(productsTable.name)
          .orderBy(desc(sql`SUM(${orderDetailTable.quantity})`))
          .limit(1); 

        if (topProductResult[0]) {
          topSellingProduct = topProductResult[0].productName;
        }
      } catch (error) {
        console.error('Error calculando el producto estrella:', error);
      }
    }


    // pasar los datos a la entidad usando el mapper
    return SalesReportMapper.toReportEntity({
      startDate: startOfPeriod,
      endDate: endOfPeriod,
      sellerName,
      totalEarnings: metrics.totalEarnings,
      averageTicket: metrics.averageTicket,
      successfulOrders: metrics.successfulOrders,
      refundedOrders: metrics.refundedOrders,
      topSellingProduct
    })


  }
}