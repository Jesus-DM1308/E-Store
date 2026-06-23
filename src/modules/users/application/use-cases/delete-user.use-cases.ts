import { CustomError } from "../../../../shared/domain/errors/custom-error.js";
import { OrderEntity, OrderRepository, statusCode } from "../../../orders/domain/index.js";
import type { UserEntity, UserRepository } from "../../domain/index.js";



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

        const statusMap: { [key: number]: string } = {
            1: statusCode.PENDING,
            2: statusCode.ACCEPTED,
            3: statusCode.PROCESSING,
            4: statusCode.SHIPPED,
            5: statusCode.DELIVERED,
            6: statusCode.RETURNED,
            7: statusCode.CANCELLED
        };


        const hasActiveOrders = userOrders.some((order: OrderEntity) => {
            const statusText = statusMap[order.statusId]
            return (
                statusText !== statusCode.CANCELLED && 
                statusText !== statusCode.DELIVERED && 
                statusText !== statusCode.RETURNED
            );
        });
        

        if( hasActiveOrders ){
            throw CustomError.badRequest(
                'No puedes dar de baja tu cuenta porque tienes órdenes activas en proceso de entrega o pago.'
            )
        }
            
      
        return this.repository.deleteById( id );
    }

}
