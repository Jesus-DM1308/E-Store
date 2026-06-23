import { and, eq } from "drizzle-orm";
import { db, productsTable } from "../../../../shared/infrastructure/index.js";
import { ProductEntity, ProductDatasource } from "../../domain/index.js";
import { CreateProductDto, UpdateProductDto } from "../../application/index.js";
import { ProductMapper } from "../mappers/product.mapper.js";

export class DrizzleProductDataSource extends ProductDatasource {

    async getById( id: number ): Promise<ProductEntity | null> {
        const [product] = await db.select()
                                .from( productsTable )
                                .where(and(eq( productsTable.id, id), eq( productsTable.isActive, true)))
        if (!product) {
            return null;
        };
        return ProductMapper.toEntity(product);
    };

    async getAll( ): Promise<ProductEntity[]> {
        const allProducts = await db.select()
                                    .from( productsTable )
                                    .where(eq( productsTable.isActive, true));
        return allProducts.map( product => ProductMapper.toEntity(product));
    };

    async create( createProductDto: CreateProductDto ): Promise<ProductEntity | null> {
        
        const [product] = await db.insert( productsTable )
                                .values(createProductDto.props)
                                .returning();
        if (!product) {
            return null;
        }
        return ProductMapper.toEntity( product );
    };

    async updateById( id: number, updateProductDto: UpdateProductDto ): Promise<ProductEntity | null> {
        const [product] = await db.update( productsTable )
                                .set({
                                    ...updateProductDto.props,
                                    updatedAt: new Date()
                                })
                                .where(and(eq( productsTable.id, id), eq( productsTable.isActive, true)))
                                .returning();
        if (!product) {
            return null;
        };
        return ProductMapper.toEntity( product );
    };

    async deleteById( id: number ): Promise<ProductEntity | null> {
        const [product] = await db.update( productsTable )
                                .set({
                                    isActive: false,
                                    deletedAt: new Date()
                                })
                                .where(eq( productsTable.id, id))
                                .returning();
        if (!product) {
            return null;
        };
        return ProductMapper.toEntity( product );
    };

    async findByName( name: string ): Promise<ProductEntity | null>{
        const [product] = await db.select()
                                .from( productsTable )
                                .where(and(eq( productsTable.name, name), eq( productsTable.isActive, true)));
        if (!product) {
            return null;
        }
        return ProductMapper.toEntity( product );

    };


};
