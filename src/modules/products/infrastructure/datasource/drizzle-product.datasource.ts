import { and, eq, gt, sql } from 'drizzle-orm';
import {
  db,
  productsTable,
  productsUsersTable,
} from '../../../../shared/infrastructure/index.js';
import {
  ProductEntity,
  ProductDatasource,
  ProductUserEntity,
} from '../../domain/index.js';
import {
  AddProductStockDto,
  CreateProductDto,
  UpdateProductDto,
} from '../../application/index.js';
import { ProductMapper } from '../mappers/product.mapper.js';
import { ProductUserMapper } from '../mappers/product-user.mapper.js';

export class DrizzleProductDataSource extends ProductDatasource {
  async getById(id: number): Promise<ProductEntity | null> {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(and(eq(productsTable.id, id), eq(productsTable.isActive, true)));
    if (!product) {
      return null;
    }
    return ProductMapper.toEntity(product);
  }

  async getAll(): Promise<ProductEntity[]> {
    const allProducts = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.isActive, true));
    return allProducts.map((product) => ProductMapper.toEntity(product));
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity | null> {
    const [product] = await db
      .insert(productsTable)
      .values(createProductDto.props)
      .returning();
    if (!product) {
      return null;
    }
    return ProductMapper.toEntity(product);
  }

  async updateById(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity | null> {
    const [product] = await db
      .update(productsTable)
      .set({
        ...updateProductDto.props,
        updatedAt: new Date(),
      })
      .where(and(eq(productsTable.id, id), eq(productsTable.isActive, true)))
      .returning();
    if (!product) {
      return null;
    }
    return ProductMapper.toEntity(product);
  }

  async deleteById(id: number): Promise<ProductEntity | null> {
    const [product] = await db
      .update(productsTable)
      .set({
        isActive: false,
        deletedAt: new Date(),
      })
      .where(and(eq(productsTable.id, id), eq(productsTable.isActive, true)))
      .returning();
    if (!product) {
      return null;
    }
    return ProductMapper.toEntity(product);
  }

  async findByName(name: string): Promise<ProductEntity | null> {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(
        and(eq(productsTable.name, name), eq(productsTable.isActive, true)),
      );
    if (!product) {
      return null;
    }
    return ProductMapper.toEntity(product);
  }

  async findSellerProduct(
    userId: string,
    productId: number,
  ): Promise<ProductUserEntity | null> {
    const [sellerProduct] = await db
      .select()
      .from(productsUsersTable)
      .where(
        and(
          eq(productsUsersTable.userId, userId),
          eq(productsUsersTable.productId, productId),
        ),
      );

    if (!sellerProduct) {
      return null;
    }

    return ProductUserMapper.toEntity(sellerProduct);
  }

  async getOffersByProductId(productId: number): Promise<ProductUserEntity[]> {
    const offers = await db
      .select()
      .from(productsUsersTable)
      .where(
        and(
          eq(productsUsersTable.productId, productId),
          gt(productsUsersTable.stock, 0),
        ),
      );

    return offers.map((offer) => ProductUserMapper.toEntity(offer));
  }

  async addSellerProductStock(
    addProductStockDto: AddProductStockDto,
  ): Promise<ProductUserEntity | null> {
    const { userId, productId, stock, price } = addProductStockDto.props;

    const currentSellerProduct = await this.findSellerProduct(
      userId,
      productId,
    );

    if (!currentSellerProduct) {
      if (price === undefined) {
        return null;
      }

      const [sellerProduct] = await db
        .insert(productsUsersTable)
        .values({
          userId,
          productId,
          stock,
          price,
        })
        .returning();

      if (!sellerProduct) {
        return null;
      }

      return ProductUserMapper.toEntity(sellerProduct);
    }

    const [sellerProduct] = await db
      .update(productsUsersTable)
      .set({
        stock: sql`${productsUsersTable.stock} + ${stock}`,
        ...(price !== undefined ? { price } : {}),
        updatedAt: new Date(),
      })
      .where(eq(productsUsersTable.id, currentSellerProduct.id))
      .returning();

    if (!sellerProduct) {
      return null;
    }

    return ProductUserMapper.toEntity(sellerProduct);
  }
}
