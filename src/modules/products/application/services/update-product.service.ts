import { CustomError } from "../../../../shared/domain/index.js";
import { ProductRepository } from "../../domain/index.js";
import { UpdateProductDto } from "../index.js";

export class UpdateProductService{

    constructor(
        private readonly productRepository: ProductRepository
    ){};

    async execute(id: number, body: { [key: string]: any } ){

        //Verificar existencia del producto en la base de datos
        const idExist = await this.productRepository.getById(id);
        if( !idExist ){
            throw CustomError.badRequest('Producto no existe.')
        };

        const data = UpdateProductDto.create(body);
        const {
            name,
            description,
            price,
            stock,
            img
        } = data.props;
        
        //Reglas de negocio

        if(price <= 0){
            throw CustomError.badRequest('Precio del producto debe ser mayor a 0.');
        };

        if(stock < 0){
            throw CustomError.badRequest('Stock del producto no puede ser menor a 0.');
        };

        if(description.length > 100){
            throw CustomError.badRequest('Descripcion del producto no puede ser mayor a 100 caracteres');
        };

        //Evitar duplicado de nombre validando que no se compare asi mismo
        const nameExists = await this.productRepository.findByName(name);
        if( nameExists && idExist.id !== id){
            throw CustomError.conflict('Nombre del producto ya existe.');
        };

        return await this.productRepository.updateById(id, data);
    };
};