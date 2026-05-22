import {
  DrizzleProductDataSource
} from "../../infrastructure/index.js";

import {
  ProductRepositoryImpl
} from "../../infrastructure/index.js";

import {
  CreateProductService,
  UpdateProductService,
  DeleteProductService,
  GetProductService
} from "../../application/index.js";

import { ProductsController } from '../index.js';
import { ProductRepository } from "../../domain/index.js";



// datasource
const datasource =
  new DrizzleProductDataSource();

// repository
const repositoryImpl =
  new ProductRepositoryImpl(
    datasource
  );

const repository =
  new ProductRepository(
    datasource
  );

// services
const createProductService =
  new CreateProductService(
    repositoryImpl
  );

const updateProductService =
  new UpdateProductService(
    repositoryImpl
  );

const deleteProductService =
  new DeleteProductService(
    repositoryImpl
  );

const getProductService =
  new GetProductService(
    repositoryImpl
  );



export const productsController =
  new ProductsController(
    createProductService,
    updateProductService,
    deleteProductService,
    getProductService,
    repository
  );