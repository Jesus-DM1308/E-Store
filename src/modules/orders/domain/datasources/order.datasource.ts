import type { CreateOrderDto } from '../../application/index.js';
import type { OrderStatusCode } from '../constants/status.constant.js';
import type { OrderDetailEntity } from '../entities/order-detail.entity.js';
import type { OrderEntity } from '../entities/order.entity.js';

export abstract class OrderDatasource {
  abstract getById(id: number): Promise<OrderEntity | null>;
  abstract getAll(): Promise<OrderEntity[]>;
  abstract getAllByUserId(userId: string): Promise<OrderEntity[]>;
  abstract getDetailsByOrderId(orderId: number): Promise<OrderDetailEntity[]>;
  abstract getStatusIdByCode(
    statusCode: OrderStatusCode,
  ): Promise<number | null>;
  abstract getStatusCodeById(statusId: number): Promise<OrderStatusCode | null>;
  abstract create(createOrderDto: CreateOrderDto): Promise<OrderEntity | null>;
  abstract updateStatus(
    id: number,
    statusId: number,
    deliveryDate?: Date,
  ): Promise<OrderEntity | null>;
  abstract cancelById(
    id: number,
    cancelledStatusId: number,
  ): Promise<OrderEntity | null>;
}
