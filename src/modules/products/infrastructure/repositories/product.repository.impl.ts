import { CreateProductDto, UpdateProductDto } from "../../application/index.js";
import { ProductRepository, ProductDatasource, ProductEntity} from "../../domain/index.js";

export class ProductRepositoryImpl implements ProductRepository {
    constructor(
        private readonly ProductDatasource: ProductDatasource
    ){};

    async getById( id: number ): Promise<ProductEntity> {
        return this.ProductDatasource.getById( id );
    };

    async getAll( ): Promise<ProductEntity[]> {
        return this.ProductDatasource.getAll();
    };

    async create( createProductDto: CreateProductDto ): Promise<ProductEntity> {
       return this.ProductDatasource.create( createProductDto );
    };

    async updateById( id: number, updateProductDto: UpdateProductDto ): Promise<ProductEntity> {
        return this.ProductDatasource.updateById( id, updateProductDto );
    };

    async deleteById( id: number ): Promise<ProductEntity> {
        return this.ProductDatasource.deleteById( id );
    };

    async findByName( name: string): Promise<ProductEntity> {
        return this.ProductDatasource.findByName( name );
    }

}