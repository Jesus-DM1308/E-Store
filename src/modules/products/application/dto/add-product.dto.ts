import { CustomError } from '../../../../shared/domain/index.js';

interface AddProductStockProps {
  userId: string;
  productId: number;
  stock: number;
  price?: number;
}

export class AddProductStockDto {
  private constructor(public readonly props: AddProductStockProps) {}

  static create(object: { [key: string]: any }): AddProductStockDto {
    const { userId, productId, stock, price } = object;

    if (!userId) {
      throw CustomError.badRequest('El id del usuario es requerido.');
    }

    const parsedProductId = Number(productId);

    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      throw CustomError.badRequest(
        'El id del producto debe ser un entero positivo.',
      );
    }

    const parsedStock = Number(stock);

    if (!Number.isInteger(parsedStock) || parsedStock <= 0) {
      throw CustomError.badRequest('El stock debe ser un entero positivo.');
    }

    if (price === undefined) {
      return new AddProductStockDto({
        userId,
        productId: parsedProductId,
        stock: parsedStock,
      });
    }

    const parsedPrice = Number(price);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      throw CustomError.badRequest('El precio debe ser un numero mayor a 0.');
    }

    return new AddProductStockDto({
      userId,
      productId: parsedProductId,
      stock: parsedStock,
      price: parsedPrice,
    });
  }
}
