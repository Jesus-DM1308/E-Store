import { CustomError } from "../../../../shared/domain/errors/custom-error.js";
import { OrderRepository } from "../../../orders/domain/index.js";
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

        const userOrders = await this.orderRepository.getByUserId(id);

        const statusMap: { [key: number]: string } = {
            1: 'Pendiente',
            2: 'Aprobado',
            3: 'Enviado',
            4: 'En transito',
            5: 'Entregado',
            6: 'Cancelado',
            7: 'Reembolsado'
        };


        const hasActiveOrders = userOrders.some( order => {
            const statusText = statusMap[order.statusId]
            return (
                statusText !== 'Cancelado' && 
                statusText !== 'Entregado' && 
                statusText !== 'Reembolsado'
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