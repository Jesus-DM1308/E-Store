import { CustomError } from "../../../../shared/domain/index.js";
import { ProductRepository } from "../../domain/index.js";
import { UpdateProductDto } from "../index.js";

export class UpdateProductService{

    constructor(
        private readonly productRepository: ProductRepository
    ){};

    async execute(id: number, data: UpdateProductDto){
        const {
            name,
            description,
            price,
            stock,
            img
        } = data;
        
        const idExist = await this.productRepository.getById(id);
        if( !idExist ){
            throw CustomError.badRequest('Producto no existe.')
        };

        if(name !== undefined) {
            const nameExists = await this.productRepository.findByName(name);
            if( nameExists && idExist.id !== id){
                throw CustomError.conflict('Nombre del producto ya existe.');
            };
        };
        
        if(name !== undefined && !name.trim()){
            throw CustomError.badRequest('Nombre del producto es requerido.');
        };

        if(price !== undefined && price <= 0){
            throw CustomError.badRequest('Precio del producto debe ser mayor a 0.');
        };

        if(stock !== undefined && stock < 0){
            throw CustomError.badRequest('Stock del producto no puede ser menor a 0.');
        };

        return await this.productRepository.updateById(id, data);
    };
};