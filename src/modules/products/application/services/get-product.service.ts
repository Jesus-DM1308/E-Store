import { CustomError } from '../../../../shared/domain/index.js';
import { ProductRepository } from '../../domain/index.js';

export class GetProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number) {
    // Verifica si el id del producto existe antes de extraerlo de la base de datos
    const product = await this.productRepository.getById(id);
    if (!product) {
      throw CustomError.notFound('El id del producto ingresado no existe.');
    }

    const offers = await this.productRepository.getOffersByProductId(id);

    return {
      ...product,
      offers,
    };
  }
}
