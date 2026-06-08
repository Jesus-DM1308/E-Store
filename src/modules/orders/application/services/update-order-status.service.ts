import { CustomError } from "../../../../shared/domain/index.js";
import { OrderRepository } from "../../domain/index.js";
import { UpdateOrderStatusDto } from "../index.js";

export class UpdateOrderStatusService {
    constructor(
        private readonly orderRepository: OrderRepository
    ){};

    async execute(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
        const order = await this.orderRepository.getById(id);

        if (!order) {
            throw CustomError.notFound('La id de la orden ingresada no existe.');
        };

        const updatedOrder = await this.orderRepository.updateStatus(id, updateOrderStatusDto);

        if (!updatedOrder) {
            throw CustomError.internalServer();
        };

        return updatedOrder;
    };
}
