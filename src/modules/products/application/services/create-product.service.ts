import { CustomError } from "../../../../shared/domain/index.js";
import { ProductRepository } from "../../domain/index.js";
import { CreateProductDto } from "../index.js";

export class CreateProductService{

    constructor(
        private readonly productRepository: ProductRepository,
    ){};

    async execute( data: CreateProductDto){
        //Se desestrcutura desde el objeto data directamente
        const {
            name,
            description,
            price,
            stock,
            img
        } = data.props;

        //Reglas de negocio
        const exists = await this.productRepository.findByName(name);
        if( exists ){
            throw CustomError.conflict('Nombre del producto ya existe');
        };
        
        return await this.productRepository.create( data );
    };
};