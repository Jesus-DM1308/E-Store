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

import {
  ProductsController
} from "../index.js"


// datasource
const datasource =
  new DrizzleProductDataSource();

// repository
const repository =
  new ProductRepositoryImpl(
    datasource
  );

// services
const createProductService =
  new CreateProductService(
    repository
  );

const updateProductService =
  new UpdateProductService(
    repository
  );

const deleteProductService =
  new DeleteProductService(
    repository
  );

const getProductService =
  new GetProductService(
    repository
  );

// controller
export const productsController =
  new ProductsController(
    createProductService,
    updateProductService,
    deleteProductService,
    getProductService,
    repository
  );