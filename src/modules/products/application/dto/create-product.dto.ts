import { CustomError } from '../../../../shared/domain/index.js';
import { LENGTH_LIMIT } from '../../domain/constants/length-limit.constant.js';

interface CreateProductProps {
  name: string;
  brand: string;
  description?: string;
  image?: string;
}

export class CreateProductDto {
  private constructor(public readonly props: CreateProductProps) {}

  static create(object: { [key: string]: any }): CreateProductDto {
    const { name, description, brand, image } = object;

    //Existence of requires attributes
    if (!name?.trim()) {
      throw CustomError.badRequest('El nombre del producto es requerido.');
    }

    if (!brand?.trim()) {
      throw CustomError.badRequest('La marca del producto es requerida.');
    }

    if (description && description.length > LENGTH_LIMIT) {
      throw CustomError.badRequest(
        `La descripcion del producto no puede ser mayor a ${LENGTH_LIMIT} caracteres.`,
      );
    }

    if (brand.length > LENGTH_LIMIT) {
      throw CustomError.badRequest(
        `La marca del producto no puede ser mayor a ${LENGTH_LIMIT} caracteres.`,
      );
    }

    return new CreateProductDto({
      name,
      description,
      brand,
      image,
    });
  }
}
