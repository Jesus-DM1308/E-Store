import { CustomError } from "../../../../shared/domain/index.js";
import { ProductRepository } from "../../domain/index.js";

export class DeleteProductService{

    constructor(
        private readonly productRepository: ProductRepository
    ){};

    async execute(id: number){

        const idExist = await this.productRepository.getById( id );
        if( !idExist ){
            throw CustomError.notFound('La id del producto ingresado no existe.')
        };

        return await this.productRepository.deleteById( id );
    };
};