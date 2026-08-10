import { CustomError } from '../../../../shared/domain/index.js';
import {
  OrderRepository,
  OrderStatusCode,
  OrderStatusPolicyService,
} from '../../domain/index.js';
import { UpdateOrderStatusDto } from '../index.js';

export class UpdateOrderStatusService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    sellerId: string,
  ) {
    const order = await this.orderRepository.getById(id);

    if (!order) {
      throw CustomError.notFound('La id de la orden ingresada no existe.');
    }

    const sellerCanUpdateOrder =
      await this.orderRepository.isSellerAssignedToOrder(id, sellerId);

    if (!sellerCanUpdateOrder) {
      throw CustomError.forbidden('No puedes actualizar esta orden.');
    }

    const currentStatusCode = await this.orderRepository.getStatusCodeById(
      order.statusId,
    );

    if (!currentStatusCode) {
      throw CustomError.badRequest(
        'El estado actual de la orden no esta configurado.',
      );
    }

    OrderStatusPolicyService.ensureCanChangeStatus(
      currentStatusCode,
      updateOrderStatusDto.props.statusCode,
    );

    const requestedStatusId = await this.orderRepository.getStatusIdByCode(
      updateOrderStatusDto.props.statusCode,
    );

    if (!requestedStatusId) {
      throw CustomError.badRequest(
        `El estado ${updateOrderStatusDto.props.statusCode} no esta configurado.`,
      );
    }

    const updatedOrder = await this.orderRepository.updateStatus(
      id,
      requestedStatusId,
      updateOrderStatusDto.props.statusCode === OrderStatusCode.DELIVERED
        ? new Date()
        : undefined,
    );

    if (!updatedOrder) {
      throw CustomError.internalServer();
    }

    return updatedOrder;
  }
}
