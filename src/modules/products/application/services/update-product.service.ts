import { CustomError } from '../../../../shared/domain/index.js';
import { ProductRepository } from '../../domain/index.js';
import { UpdateProductDto } from '../index.js';

export class UpdateProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number, body: { [key: string]: any }) {
    // Verifica si el id del producto existe antes de extraerlo de la base de datos
    const product = await this.productRepository.getById(id);
    if (!product) {
      throw CustomError.badRequest('El id del producto ingresado no existe.');
    }

    const data = UpdateProductDto.create(body);
    const { name } = data.props;

    if (name !== undefined) {
      const nameExists = await this.productRepository.findByName(name);
      //Verifica si se duplica el nombre del producto evitando que se compare asi mismo
      if (nameExists?.name === name && nameExists.id !== id) {
        throw CustomError.conflict('El nombre del producto ya existe.');
      }
    }

    const updatedProduct = await this.productRepository.updateById(id, data);

    if (!updatedProduct) {
      throw CustomError.badRequest('No se pudo actualizar el producto.');
    }

    return updatedProduct;
  }
}
