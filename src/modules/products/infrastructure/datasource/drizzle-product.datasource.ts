import { eq } from "drizzle-orm";
import { db, productsTable } from "../../../../shared/infrastructure/index.js";
import { ProductEntity, ProductDatasource } from "../../domain/index.js";
import { CreateProductDto, UpdateProductDto } from "../../application/index.js";

export class DrizzleProductDataSource extends ProductDatasource {

    async getById( id: number ): Promise<ProductEntity | null> {
        const [product] = await db.select()
                                .from( productsTable )
                                .where(eq(productsTable.id, id));
        if (!product) {
            return null;
        };
        return ProductEntity.fromObject(product);
    };

    async getAll( ): Promise<ProductEntity[]> {
        const allProducts = await db.select()
                                    .from( productsTable );
        return allProducts.map( product => ProductEntity.fromObject(product));
    };

    async create( createProductDto: CreateProductDto ): Promise<ProductEntity | null> {
        
        const [product] = await db.insert( productsTable )
                                .values(createProductDto.props)
                                .returning();
        if (!product) {
            return null;
        }
        return ProductEntity.fromObject( product );
    };

    async updateById( id: number, updateProductDto: UpdateProductDto ): Promise<ProductEntity | null> {
        const [product] = await db.update( productsTable )
                                .set({
                                    ...updateProductDto.props,
                                    updated_at: new Date()
                                })
                                .where(eq( productsTable.id, id))
                                .returning();
        if (!product) {
            return null;
        };
        return ProductEntity.fromObject( product );
    };

    async deleteById( id: number ): Promise<ProductEntity | null> {
        const [product] = await db.delete( productsTable )
                                .where(eq( productsTable.id, id))
                                .returning();
        if (!product) {
            return null;
        };
        return ProductEntity.fromObject( product );
    };

    async findByName( name: string ): Promise<ProductEntity | null>{
        const [product] = await db.select()
                                .from( productsTable )
                                .where(eq( productsTable.name, name));
        if (!product) {
            return null;
        }
        return ProductEntity.fromObject( product );

    };


};