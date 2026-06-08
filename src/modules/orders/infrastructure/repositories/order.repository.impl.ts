import { CreateOrderDto, UpdateOrderStatusDto } from "../../application/index.js";
import { OrderDatasource, OrderDetailEntity, OrderEntity, OrderRepository } from "../../domain/index.js";

export class OrderRepositoryImpl implements OrderRepository {
    constructor(
        private readonly orderDatasource: OrderDatasource
    ){};

    async getAll(): Promise<OrderEntity[]> {
        return this.orderDatasource.getAll();
    };

    async getById(id: number): Promise<OrderEntity | null> {
        return this.orderDatasource.getById(id);
    };

    async getByUserId(userId: string): Promise<OrderEntity[]> {
        return this.orderDatasource.getByUserId(userId);
    };

    async getDetailsByOrderId(orderId: number): Promise<OrderDetailEntity[]> {
        return this.orderDatasource.getDetailsByOrderId(orderId);
    };

    async create(createOrderDto: CreateOrderDto): Promise<OrderEntity | null> {
        return this.orderDatasource.create(createOrderDto);
    };

    async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderEntity | null> {
        return this.orderDatasource.updateStatus(id, updateOrderStatusDto);
    };

    async deleteById(id: number): Promise<OrderEntity | null> {
        return this.orderDatasource.deleteById(id);
    };
}
