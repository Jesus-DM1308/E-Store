import { OrderRepository } from "../../domain/index.js";

export class GetUserOrdersService {
    constructor(
        private readonly orderRepository: OrderRepository
    ){};

    async execute(userId: string) {
        return this.orderRepository.getByUserId(userId);
    };
}
