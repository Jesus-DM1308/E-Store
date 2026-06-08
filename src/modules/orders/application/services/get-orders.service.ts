import { OrderRepository } from "../../domain/index.js";

export class GetOrdersService {
    constructor(
        private readonly orderRepository: OrderRepository
    ){};

    async execute() {
        return this.orderRepository.getAll();
    };
}
