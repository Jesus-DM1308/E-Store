import {
  AddProductStockDto,
  CreateProductDto,
  UpdateProductDto,
} from '../../application/index.js';
import {
  ProductRepository,
  ProductDatasource,
  ProductEntity,
  ProductUserEntity,
} from '../../domain/index.js';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly ProductDatasource: ProductDatasource) {}

  async getById(id: number): Promise<ProductEntity | null> {
    return this.ProductDatasource.getById(id);
  }

  async getAll(): Promise<ProductEntity[]> {
    return this.ProductDatasource.getAll();
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity | null> {
    return this.ProductDatasource.create(createProductDto);
  }

  async updateById(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity | null> {
    return this.ProductDatasource.updateById(id, updateProductDto);
  }

  async deleteById(id: number): Promise<ProductEntity | null> {
    return this.ProductDatasource.deleteById(id);
  }

  async findByName(name: string): Promise<ProductEntity | null> {
    return this.ProductDatasource.findByName(name);
  }

  async findSellerProduct(
    userId: string,
    productId: number,
  ): Promise<ProductUserEntity | null> {
    return this.ProductDatasource.findSellerProduct(userId, productId);
  }

  async getOffersByProductId(productId: number): Promise<ProductUserEntity[]> {
    return this.ProductDatasource.getOffersByProductId(productId);
  }

  async addSellerProductStock(
    addProductStockDto: AddProductStockDto,
  ): Promise<ProductUserEntity | null> {
    return this.ProductDatasource.addSellerProductStock(addProductStockDto);
  }
}
