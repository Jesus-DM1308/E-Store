import { CustomError } from "../../../../shared/domain/index.js";
import { OrderRepository } from "../../domain/index.js";
import { CreateOrderDto } from "../index.js";

export class CreateOrderService {
    constructor(
        private readonly orderRepository: OrderRepository
    ){};

    async execute(createOrderDto: CreateOrderDto) {
        const order = await this.orderRepository.create(createOrderDto);

        if (!order) {
            throw CustomError.internalServer();
        };

        return order;
    };
}
