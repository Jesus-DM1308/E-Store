import { CustomError } from "../../../../shared/domain/errors/custom-error.js";
import { OrderRepository } from "../../../orders/domain/index.js";
import type { UserEntity, UserRepository } from "../../domain/index.js";
import { OrderStatusCode } from "../../../orders/domain/index.js";



export interface DeleteUserUseCases {
    execute( id: string ): Promise<UserEntity>;
}



export class DeleteUser implements DeleteUserUseCases {


    constructor(
        private readonly repository: UserRepository,
        private readonly orderRepository: OrderRepository
    ){}

    async execute(id: string): Promise<UserEntity> {

        const userOrders = await this.orderRepository.getAllByUserId(id);

        if (userOrders.length === 0) {
            return this.repository.deleteById(id);
        }

        const cancelledId = await this.orderRepository.getStatusIdByCode(OrderStatusCode.CANCELLED);
        const deliveredId = await this.orderRepository.getStatusIdByCode(OrderStatusCode.DELIVERED);
        const refundedId = await this.orderRepository.getStatusIdByCode(OrderStatusCode.REFUNDED);


        if (!cancelledId || !deliveredId || !refundedId) {
            throw CustomError.internalServer();
        }

        
        const inactiveStatusIds = [cancelledId, deliveredId, refundedId];

        const hasActiveOrders = userOrders.some(order => 
            !inactiveStatusIds.includes(order.statusId)
        );

        if( hasActiveOrders ){
            throw CustomError.badRequest(
                'No puedes dar de baja tu cuenta porque tienes órdenes activas en proceso de entrega o pago.'
            )
        }
            
      
        return this.repository.deleteById( id );
    }

}