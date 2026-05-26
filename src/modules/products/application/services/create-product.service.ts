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
        if(price <= 0){
            throw CustomError.badRequest('Precio del producto debe ser mayor a 0');
        };
        
        if(stock < 0){
            throw CustomError.badRequest('Stock del producto no puede ser menor a 0');
        };

        if(description.length > 100){
            throw CustomError.badRequest('Descripcion del producto no puede ser mayor a 100 caracteres');
        };

        const exists = await this.productRepository.findByName(name);
        if( exists ){
            throw CustomError.conflict('Nombre del producto ya existe');
        };
        
        return await this.productRepository.create( data );
    };
};