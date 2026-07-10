import { CustomError } from '../../../../shared/domain/index.js';
import { OrderStatusCode } from '../../domain/index.js';

interface UpdateOrderStatusProps {
  statusCode: OrderStatusCode;
}

export class UpdateOrderStatusDto {
  private constructor(public readonly props: UpdateOrderStatusProps) {}

  static create(object: { [key: string]: any }): UpdateOrderStatusDto {
    const statusCode = object.statusCode ?? object.status_code;

    if (!Object.values(OrderStatusCode).includes(statusCode)) {
      throw CustomError.badRequest('El estado de la orden no es valido.');
    }

    return new UpdateOrderStatusDto({ statusCode });
  }
}
