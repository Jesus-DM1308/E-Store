import { CustomError } from '../../../../shared/domain/index.js';
import { LENGTH_LIMIT } from '../../domain/constants/length-limit.constant.js';

export interface UpdateProductProps {
  name?: string;
  description?: string;
  brand?: string;
  image?: string;
}

export class UpdateProductDto {
  private constructor(public readonly props: UpdateProductProps) {}

  static create(object: { [key: string]: any }): UpdateProductDto {
    const { name, description, brand, image } = object;

    const updatedProduct: UpdateProductProps = {};

    if (name !== undefined) {
      updatedProduct.name = name;
    }

    if (description !== undefined) {
      if (description.length > LENGTH_LIMIT) {
        throw CustomError.badRequest(
          `La descripcion del producto no puede ser mayor a ${LENGTH_LIMIT} caracteres.`,
        );
      }

      updatedProduct.description = description;
    }

    if (brand !== undefined) {
      if (brand.length > LENGTH_LIMIT) {
        throw CustomError.badRequest(
          `La marca del producto no puede ser mayor a ${LENGTH_LIMIT} caracteres.`,
        );
      }

      updatedProduct.brand = brand;
    }

    if (image !== undefined) {
      updatedProduct.image = image;
    }

    return new UpdateProductDto(updatedProduct);
  }
}
