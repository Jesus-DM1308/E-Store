import { CustomError } from "../../../../shared/domain/index.js";
import { ProductRepository } from "../../domain/index.js";

export class GetProductService{

    constructor(
        private readonly productRepository: ProductRepository
    ){};

    async execute(id: number){

        const product = await this.productRepository.getById( id );
        if( !product ){
            throw CustomError.notFound('La id del producto ingresado no existe.')
        };

        return product;
    };
};