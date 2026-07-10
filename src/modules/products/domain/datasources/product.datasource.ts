import type { ProductEntity, ProductUserEntity } from '../index.js';
import {
  AddProductStockDto,
  CreateProductDto,
  UpdateProductDto,
} from '../../application/index.js';

export abstract class ProductDatasource {
  abstract getById(id: number): Promise<ProductEntity | null>;
  abstract getAll(): Promise<ProductEntity[]>;
  abstract create(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity | null>;
  abstract updateById(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity | null>;
  abstract deleteById(id: number): Promise<ProductEntity | null>;
  abstract findByName(name: string): Promise<ProductEntity | null>;
  abstract findSellerProduct(
    userId: string,
    productId: number,
  ): Promise<ProductUserEntity | null>;
  abstract getOffersByProductId(productId: number): Promise<ProductUserEntity[]>;
  abstract addSellerProductStock(
    addProductStockDto: AddProductStockDto,
  ): Promise<ProductUserEntity | null>;
}
