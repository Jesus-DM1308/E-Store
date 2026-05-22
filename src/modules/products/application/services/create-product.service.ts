import { CustomError } from "../../../../shared/domain/index.js";
import { ProductRepository } from "../../domain/index.js";
import { CreateProductDto } from "../index.js";

export class CreateProductService{

    constructor(
        private readonly productRepository: ProductRepository
    ){};

    async execute( data: CreateProductDto){
        const {
            name,
            description,
            price,
            stock,
            img
        } = data;
        
        if(!name.trim()){
            CustomError.badRequest('Nombre del producto es requerido');
        };

        if(price <= 0){
            CustomError.badRequest('Precio del producto debe ser mayor a 0');
        };

        if(stock < 0){
            CustomError.badRequest('Stock del producto no puede ser menor a 0');
        };

        const exists = await this.productRepository.findByName(name);
        if( exists ){
            CustomError.conflict('Nombre del producto ya existe');
        };

        return await this.productRepository.create({
            name,
            description,
            price,
            stock,
            img
        });
    };
};