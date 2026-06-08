import { CustomError } from "../../../../shared/domain/index.js";
import { OrderRepository } from "../../domain/index.js";

export class GetOrderService {
    constructor(
        private readonly orderRepository: OrderRepository
    ){};

    async execute(id: number) {
        const order = await this.orderRepository.getById(id);

        if (!order) {
            throw CustomError.notFound('La id de la orden ingresada no existe.');
        };

        const details = await this.orderRepository.getDetailsByOrderId(id);

        return {
            ...order,
            details
        };
    };
}
