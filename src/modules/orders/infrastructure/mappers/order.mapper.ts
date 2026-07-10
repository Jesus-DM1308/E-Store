import { OrderEntity } from '../../domain/index.js';

export class OrderMapper {
  static toEntity(object: { [key: string]: any }): OrderEntity {
    const {
      id,
      statusId,
      userId,
      total,
      address,
      whoReceive,
      deliveryDate,
      updatedAt,
      createdAt,
    } = object;

    return new OrderEntity(
      id,
      statusId,
      userId,
      total,
      address,
      whoReceive,
      deliveryDate,
      updatedAt,
      createdAt,
    );
  }
}
