import type { ProductEntity } from "../entities/product.entity.js";
import { CreateProductDto, UpdateProductDto } from '../../application/index.js';

export abstract class ProductRepository {
    abstract getById( id: number ): Promise<ProductEntity | null>;
    abstract getAll( ): Promise<ProductEntity[]>;
    abstract create( createProductDto: CreateProductDto): Promise<ProductEntity | null>;
    abstract updateById( id: number, updateProductDto :UpdateProductDto ): Promise<ProductEntity | null>;
    abstract deleteById( id: number ): Promise<ProductEntity | null>;
    abstract findByName( name: string ): Promise<ProductEntity | null>;
}