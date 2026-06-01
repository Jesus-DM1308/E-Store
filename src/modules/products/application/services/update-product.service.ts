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
            const nameExists = await this.productRepository.findByName(name);
            //Evitar duplicado de nombre validando que no se compare asi mismo
            if( nameExists?.name === name && nameExists.id !== id){
                throw CustomError.conflict('Nombre del producto ya existe.');
            };
        };

        return await this.productRepository.updateById(id, data);
    };
};