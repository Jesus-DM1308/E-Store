 import { CreateOrderDto } from '../../application/index.js';
import {
  OrderDatasource,
  OrderDetailEntity,
  OrderEntity,
  OrderRepository,
  OrderStatusCode,
  SellerOrdersByStatus,
} from '../../domain/index.js';

export class OrderRepositoryImpl implements OrderRepository {
  constructor(private readonly orderDatasource: OrderDatasource) {}
  async getById(id: number): Promise<OrderEntity | null> {
    return this.orderDatasource.getById(id);
  }

  async getAll(): Promise<OrderEntity[]> {
    return this.orderDatasource.getAll();
  }

  async getAllByUserId(userId: string): Promise<OrderEntity[]> {
    return this.orderDatasource.getAllByUserId(userId);
  }

  async getSellerOrdersByStatus(sellerId: string): Promise<SellerOrdersByStatus> {
    return this.orderDatasource.getSellerOrdersByStatus(sellerId);
  }

  async getDetailsByOrderId(orderId: number): Promise<OrderDetailEntity[]> {
    return this.orderDatasource.getDetailsByOrderId(orderId);
  }

  async getStatusIdByCode(statusCode: OrderStatusCode): Promise<number | null> {
    return this.orderDatasource.getStatusIdByCode(statusCode);
  }

  async getStatusCodeById(statusId: number): Promise<OrderStatusCode | null> {
    return this.orderDatasource.getStatusCodeById(statusId);
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity | null> {
    return this.orderDatasource.create(createOrderDto);
  }

  async updateStatus(
    id: number,
    statusId: number,
    deliveryDate?: Date,
  ): Promise<OrderEntity | null> {
    return this.orderDatasource.updateStatus(id, statusId, deliveryDate);
  }

  async cancelById(
    id: number,
    cancelledStatusId: number,
  ): Promise<OrderEntity | null> {
    return this.orderDatasource.cancelById(id, cancelledStatusId);
  }
}
