import { CustomError } from '../../../../shared/domain/index.js';
import { ProductRepository } from '../../domain/index.js';
import { CreateProductDto } from '../index.js';

export class CreateProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(data: CreateProductDto) {
    // Evita duplicar nombres de productos
    const exists = await this.productRepository.findByName(data.props.name);
    if (exists) {
      throw CustomError.conflict('El nombre del producto ya existe.');
    }

    return await this.productRepository.create(data);
  }
}
