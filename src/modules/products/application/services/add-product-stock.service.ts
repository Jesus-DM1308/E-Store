import { CustomError } from '../../../../shared/domain/index.js';
import { ProductRepository } from '../../domain/index.js';
import { AddProductStockDto } from '../index.js';

export class AddProductStockService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(addProductStockDto: AddProductStockDto) {
    const { userId, productId, price } = addProductStockDto.props;

    const product = await this.productRepository.getById(productId);

    if (!product) {
      throw CustomError.notFound('La id del producto ingresada no existe.');
    }

    const sellerProduct = await this.productRepository.findSellerProduct(
      userId,
      productId,
    );

    if (!sellerProduct && price === undefined) {
      throw CustomError.badRequest(
        'El precio es requerido cuando el vendedor registra este producto por primera vez.',
      );
    }

    const updatedSellerProduct =
      await this.productRepository.addSellerProductStock(addProductStockDto);

    if (!updatedSellerProduct) {
      throw CustomError.internalServer();
    }

    return updatedSellerProduct;
  }
}
