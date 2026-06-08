import { OrderDetailEntity } from "../../domain/index.js";

export class OrderDetailMapper {
    static toEntity(object: { [key: string]: any }): OrderDetailEntity {
        const {
            id,
            order_id,
            product_id,
            quantity,
            unit_price,
            updated_at,
            created_at
        } = object;

        return new OrderDetailEntity(
            id,
            order_id,
            product_id,
            quantity,
            unit_price,
            updated_at,
            created_at
        );
    };
}
