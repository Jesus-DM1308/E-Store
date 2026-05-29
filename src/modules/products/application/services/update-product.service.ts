import { CustomError } from "../../../../shared/domain/index.js";
import { ProductRepository } from "../../domain/index.js";
import { UpdateProductDto } from "../index.js";

export class UpdateProductService{

    constructor(
        private readonly productRepository: ProductRepository
    ){};

    async execute(id: number, body: { [key: string]: any } ){

        //Verificar existencia del producto en la base de datos
        const product = await this.productRepository.getById(id);
        if( !product ){
            throw CustomError.badRequest('La id del producto ingresado no existe.')
        };

        const data = UpdateProductDto.create(body);
        const {
            name,
            description,
            price,
            stock,
            img
        } = data.props;
        
        if( name !== undefined ){
            //Evitar duplicado de nombre validando que no se compare asi mismo
            if( product.name === name && product.id !== id){
                throw CustomError.conflict('Nombre del producto ya existe.');
            };
        };

        return await this.productRepository.updateById(id, data);
    };
};