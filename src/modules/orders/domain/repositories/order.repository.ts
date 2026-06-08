import type { CreateOrderDto, UpdateOrderStatusDto } from "../../application/index.js";
import type { OrderDetailEntity } from "../entities/order-detail.entity.js";
import type { OrderEntity } from "../entities/order.entity.js";

export abstract class OrderRepository {
    abstract getAll(): Promise<OrderEntity[]>;
    abstract getById(id: number): Promise<OrderEntity | null>;
    abstract getByUserId(userId: string): Promise<OrderEntity[]>;
    abstract getDetailsByOrderId(orderId: number): Promise<OrderDetailEntity[]>;
    abstract create(createOrderDto: CreateOrderDto): Promise<OrderEntity | null>;
    abstract updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderEntity | null>;
    abstract deleteById(id: number): Promise<OrderEntity | null>;
}
