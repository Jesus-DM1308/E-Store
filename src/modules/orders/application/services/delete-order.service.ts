import { CustomError } from "../../../../shared/domain/index.js";
import { OrderRepository } from "../../domain/index.js";

export class DeleteOrderService {
    constructor(
        private readonly orderRepository: OrderRepository
    ){};

    async execute(id: number) {
        const order = await this.orderRepository.getById(id);

        if (!order) {
            throw CustomError.notFound('La id de la orden ingresada no existe.');
        };

        const deletedOrder = await this.orderRepository.cancelById(id);

        if (!deletedOrder) {
            throw CustomError.badRequest('La orden no puede ser cancelada en su estado actual.');
        };

        return deletedOrder;
    };
}
