import type { ProductEntity } from "../entities/product.entity.js";
import { CreateProductDto, UpdateProductDto } from '../../application/index.js';

export abstract class ProductDatasource{
    abstract getById( id: number ): Promise<ProductEntity>;
    abstract getAll( ): Promise<ProductEntity[]>;
    abstract create( createProductDto: CreateProductDto): Promise<ProductEntity>;
    abstract updateById( id: number, updateProductDto :UpdateProductDto ): Promise<ProductEntity>;
    abstract deleteById( id: number ): Promise<ProductEntity>;
    abstract findByName( name: string ): Promise<ProductEntity>;

}