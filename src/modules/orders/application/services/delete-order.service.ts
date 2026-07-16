import { CustomError } from '../../../../shared/domain/index.js';
import {
  OrderRepository,
  OrderStatusCode,
  OrderStatusPolicyService,
} from '../../domain/index.js';

export class DeleteOrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: number) {
    const order = await this.orderRepository.getById(id);

    if (!order) {
      throw CustomError.notFound('La id de la orden ingresada no existe.');
    }

    const currentStatusCode = await this.orderRepository.getStatusCodeById(
      order.statusId,
    );

    if (!currentStatusCode) {
      throw CustomError.badRequest(
        'El estado actual de la orden no esta configurado.',
      );
    }

    OrderStatusPolicyService.ensureCanCancel(currentStatusCode);

    const cancelledStatusId = await this.orderRepository.getStatusIdByCode(
      OrderStatusCode.CANCELLED,
    );

    if (!cancelledStatusId) {
      throw CustomError.badRequest('El estado CANCELLED no esta configurado.');
    }

    const deletedOrder = await this.orderRepository.cancelById(
      id,
      cancelledStatusId,
    );

    if (!deletedOrder) {
      throw CustomError.badRequest(
        'La orden no puede ser cancelada en su estado actual.',
      );
    }

    return deletedOrder;
  }
}
