import { ProductUserEntity } from '../../domain/index.js';

export class ProductUserMapper {
  static toEntity(object: { [key: string]: any }): ProductUserEntity {
    const { id, userId, productId, price, stock, createdAt, updatedAt } =
      object;

    return new ProductUserEntity(
      id,
      userId,
      productId,
      price,
      stock,
      createdAt,
      updatedAt,
    );
  }
}
