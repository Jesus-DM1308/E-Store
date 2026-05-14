import type { ProductEntity } from "../entities/product.entity.ts";
import { CreateProductDto, UpdateProductDto } from '../../application/index.ts';

export abstract class ProductRepository {
    constructor(){};

    abstract getProductById( id: number ): Promise<ProductEntity>;
    abstract getProducts( createTProductDto :CreateProductDto ): Promise<ProductEntity[]>;
    abstract getImageOfProduct( id: number ): Promise<ProductEntity>;
    abstract createProduct( updateProductDto: UpdateProductDto): Promise<ProductEntity>;
    abstract updateProduct( id: number ): Promise<ProductEntity>;
    abstract deleteProduct( id: number ): Promise<ProductEntity>;
}