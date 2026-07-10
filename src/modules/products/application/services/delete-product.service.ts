import { CustomError } from '../../../../shared/domain/index.js';
import { ProductRepository } from '../../domain/index.js';

export class DeleteProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number) {
    // Verifica si el id del producto existe antes de eliminarlo de la base de datos
    const idExist = await this.productRepository.getById(id);
    if (!idExist) {
      throw CustomError.notFound('El id del producto ingresado no existe.');
    }

    const deletedProduct = await this.productRepository.deleteById(id);

    if (!deletedProduct) {
      throw CustomError.badRequest('No se pudo desactivar el producto.');
    }

    return deletedProduct;
  }
}
