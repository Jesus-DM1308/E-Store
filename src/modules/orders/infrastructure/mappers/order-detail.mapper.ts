import { OrderDetailEntity } from "../../domain/index.js";

export class OrderDetailMapper {
    static toEntity(object: { [key: string]: any }): OrderDetailEntity {
        const {
            id,
            orderId,
            productId,
            quantity,
            unitPrice,
            updatedAt,
            createdAt
        } = object;

        return new OrderDetailEntity(
            id,
            orderId,
            productId,
            quantity,
            unitPrice,
            updatedAt,
            createdAt
        );
    };
}
