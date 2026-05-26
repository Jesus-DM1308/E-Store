import { CustomError } from "../../../../shared/domain/index.js";
import { ProductRepository } from "../../domain/index.js";

export class GetProductService{

    constructor(
        private readonly productRepository: ProductRepository
    ){};

    async execute(id: number){

        const idExist = await this.productRepository.getById( id );
        if( !idExist ){
            throw CustomError.badRequest('El Producto ingresado no existe.')
        };

        return await this.productRepository.getById( id );
    };
};