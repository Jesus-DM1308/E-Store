import { OrderAddressEntity, ReportOrderEntity, SalesReportEntity } from "../../domain/index.js";


export class SalesReportMapper {

  // el json lo convierte a la entidad de dirección
  static toAddressEntity( object: { [key: string]: any } ): OrderAddressEntity {
    const { street, colony, references, postal_code } = object;

    return new OrderAddressEntity(
      street ?? '',
      colony ?? '',
      references ?? '',
      postal_code ?? ''
    );
  }

  // se convierte la orden en una entidad
  static toOrderEntity( object: { [key: string]: any } ): ReportOrderEntity {
    const { id, total, status, delivery_date, created_at, address } = object;

    const addressEntity = SalesReportMapper.toAddressEntity( address ?? {} );


    return new ReportOrderEntity(
      id,
      total,
      status,
      delivery_date ? new Date(delivery_date) : null,
      created_at ? new Date(created_at) : new Date(),
      addressEntity
    );
  }

  // este en si es el mapper principal que une los totales globales y el arreglo de ordenes
  static toReportEntity( object: { [key: string]: any } ): SalesReportEntity {
    const { startDate, endDate, totalEarnings, totalOrders, averageTicket, orders } = object;

    
    const orderEntities = Array.isArray(orders)
      ? orders.map( order => SalesReportMapper.toOrderEntity(order) )
      : [];

    return new SalesReportEntity(
      startDate,
      endDate,
      totalEarnings ?? 0,
      totalOrders ?? 0,
      averageTicket ?? 0,
      orderEntities
    );
  }
}