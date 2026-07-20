import { OrderRepository } from '../../domain/index.js';

export class GetSellerOrdersService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(sellerId: string) {
    return this.orderRepository.getSellerOrdersByStatus(sellerId);
  }
}
