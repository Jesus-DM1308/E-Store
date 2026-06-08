import { OrderEntity } from "../../domain/index.js";

export class OrderMapper {
    static toEntity(object: { [key: string]: any }): OrderEntity {
        const {
            id,
            status,
            user_id,
            total,
            address,
            delivery_date,
            updated_at,
            created_at
        } = object;

        return new OrderEntity(
            id,
            status,
            user_id,
            total,
            address,
            delivery_date,
            updated_at,
            created_at
        );
    };
}
