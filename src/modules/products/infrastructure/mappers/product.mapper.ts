import { ProductEntity } from '../../domain/entities/product.entity.js';
export class ProductMapper {
  static toEntity(object: { [key: string]: any }): ProductEntity {
    const {
      id,
      name,
      brand,
      description,
      image,
      isActive,
      deletedAt,
      createdAt,
      updatedAt,
    } = object;

    return new ProductEntity(
      id,
      name,
      brand,
      description,
      image,
      isActive,
      deletedAt,
      createdAt,
      updatedAt,
    );
  }
}
