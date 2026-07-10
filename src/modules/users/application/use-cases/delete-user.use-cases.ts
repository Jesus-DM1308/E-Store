import { CustomError } from '../../../../shared/domain/errors/custom-error.js';
import {
  OrderRepository,
  OrderStatusCode,
} from '../../../orders/domain/index.js';
import type { UserEntity, UserRepository } from '../../domain/index.js';

export interface DeleteUserUseCases {
  execute(id: string): Promise<UserEntity>;
}

export class DeleteUser implements DeleteUserUseCases {
  constructor(
    private readonly repository: UserRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(id: string): Promise<UserEntity> {
    const userOrders = await this.orderRepository.getAllByUserId(id);

    const terminalStatuses = [
      OrderStatusCode.CANCELLED,
      OrderStatusCode.DELIVERED,
      OrderStatusCode.REFUNDED,
    ];

    let hasActiveOrders = false;

    for (const order of userOrders) {
      const statusCode = await this.orderRepository.getStatusCodeById(
        order.statusId,
      );

      if (!statusCode || !terminalStatuses.includes(statusCode)) {
        hasActiveOrders = true;
        break;
      }
    }

    if (hasActiveOrders) {
      throw CustomError.badRequest(
        'No puedes dar de baja tu cuenta porque tienes órdenes activas en proceso de entrega o pago.',
      );
    }

    return this.repository.deleteById(id);
  }
}
