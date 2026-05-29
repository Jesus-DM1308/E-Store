import { ProductEntity } from '../../domain/entities/product.entity.js';
export class ProductMapper {

    static toEntity( object: { [ key: string ]: any } ): ProductEntity{
        const {
            id,
            name,
            description,
            price,
            stock,
            img,
            created_at,
            updated_at
        } = object;

        return new ProductEntity(
            id,
            name,
            description,
            price,
            stock,
            img,
            created_at,
            updated_at
        );
    };
};