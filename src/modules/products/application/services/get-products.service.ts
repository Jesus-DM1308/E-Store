import { CustomError } from "../../../../shared/domain/index.js";
import { ProductRepository } from "../../domain/index.js";

export class GetProductsService{

    constructor(
        private readonly productRepository: ProductRepository
    ){};

    async execute(){

        const products = await this.productRepository.getAll();

        return products;
    };
};