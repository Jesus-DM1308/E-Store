import { and, gte, lte, sql, eq, desc } from 'drizzle-orm';
import { ReportDatasource, SalesReportEntity } from '../../domain/index.js';
import { orderDetailTable, ordersTable, productsTable, usersTable, productsUsersTable } from '../../../../shared/infrastructure/index.js';
import { SalesReportMapper } from '../mappers/sales-report.mapper.js';
import { OrderRepository } from '../../../orders/domain/repositories/order.repository.js';
import { OrderStatusCode } from '../../../orders/domain/constants/order-status.constant.js';

export class ReportDatasourceImpl implements ReportDatasource {

  constructor(
    private readonly db: any, 
    private readonly orderRepository: OrderRepository
  ) {}

  async getSalesReport(startDate: Date, endDate: Date, sellerId: string): Promise<SalesReportEntity> {

    const startOfPeriod = new Date(startDate);
    const endOfPeriod = new Date(endDate);
    
    // inicio y fin de las fechas de todo el dia
    startOfPeriod.setUTCHours(0, 0, 0, 0);
    endOfPeriod.setUTCHours(23, 59, 59, 999);

    // se obtienen los ids del estado entregado y rembolsado
    const successfulId = await this.orderRepository.getStatusIdByCode(OrderStatusCode.DELIVERED);
    const refundedId = await this.orderRepository.getStatusIdByCode(OrderStatusCode.REFUNDED);

    if (!successfulId || !refundedId) {
        throw new Error('Los estados no están configurados en la base de datos');
    }

    // buscar nombre del vendedor
    const userResult = await this.db
      .select({ name: usersTable.name })
      .from(usersTable)
      .where(eq(usersTable.id, sellerId))
      .limit(1); 
    
    const sellerName = userResult[0]?.name ?? 'Vendedor no encontrado';

    // datos principales del reporte
    const metricsResult = await this.db
      .select({
        totalEarnings: sql`COALESCE(SUM(CASE WHEN ${ordersTable.statusId} = ${successfulId} THEN ${orderDetailTable.quantity} * ${orderDetailTable.unitPrice} ELSE 0 END), 0)`.mapWith(Number),
        successfulOrders: sql`COALESCE(COUNT(DISTINCT CASE WHEN ${ordersTable.statusId} = ${successfulId} THEN ${ordersTable.id} END), 0)`.mapWith(Number),
        refundedOrders: sql`COALESCE(COUNT(DISTINCT CASE WHEN ${ordersTable.statusId} = ${refundedId} THEN ${ordersTable.id} END), 0)`.mapWith(Number)
      })
      .from(orderDetailTable)
      .innerJoin(ordersTable, eq(orderDetailTable.orderId, ordersTable.id))
      .innerJoin(productsUsersTable, eq(orderDetailTable.productUserId, productsUsersTable.id))
      .where(
        and(
          eq(productsUsersTable.userId, sellerId),
          gte(ordersTable.createdAt, startOfPeriod),
          lte(ordersTable.createdAt, endOfPeriod)
        )
      );

    const metrics = metricsResult[0] || { totalEarnings: 0, successfulOrders: 0, refundedOrders: 0 };

    // calcular el promedio vendido
    const averageTicket = metrics.successfulOrders > 0 
      ? Number((metrics.totalEarnings / metrics.successfulOrders).toFixed(2)) 
      : 0;
    
    // por default lo pongo como Ninguno
    let topSellingProduct = 'Ninguno';
    
    // buscar el producto mas vendido
    if (metrics.successfulOrders > 0) {
      try {
        const topProductResult = await this.db
          .select({ productName: productsTable.name })
          .from(orderDetailTable)
          .innerJoin(ordersTable, eq(orderDetailTable.orderId, ordersTable.id)) 
          .innerJoin(productsUsersTable, eq(orderDetailTable.productUserId, productsUsersTable.id))
          .innerJoin(productsTable, eq(productsUsersTable.productId, productsTable.id))
          .where(
            and(
              eq(productsUsersTable.userId, sellerId),
              eq(ordersTable.statusId, successfulId), 
              gte(ordersTable.createdAt, startOfPeriod),
              lte(ordersTable.createdAt, endOfPeriod)
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
      averageTicket,
      successfulOrders: metrics.successfulOrders,
      refundedOrders: metrics.refundedOrders,
      topSellingProduct
    });
  }
}