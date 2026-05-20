import type { ProductEntity } from "../entities/product.entity.js";
import { ProductDto } from '../../application/index.js';

export abstract class ProductRepository {
    constructor(){};

    abstract getProductById( id: number ): Promise<ProductEntity>;
    abstract getProducts( productDto :ProductDto ): Promise<ProductEntity[]>;
    abstract getImageOfProduct( id: number ): Promise<ProductEntity>;
    abstract createProduct( productDto: ProductDto): Promise<ProductEntity>;
    abstract updateProduct( id: number ): Promise<ProductEntity>;
    abstract deleteProduct( id: number ): Promise<ProductEntity>;
    abstract getNameOfProduct( name: string ): Promise<ProductEntity>
}