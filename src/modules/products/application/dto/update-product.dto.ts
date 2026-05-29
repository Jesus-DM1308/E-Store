import { CustomError } from '../../../../shared/domain/index.js';

export interface UpdateProductProps{
    name?: string;
    description?: string,
    price?: number;
    stock?: number,
    img?: string
};

export class UpdateProductDto{

    private constructor(
        public readonly props: UpdateProductProps
    ){};

    static create( object: {[key: string]: any}): UpdateProductDto{
        const {
            name,
            description,
            price,
            stock,
            img
        } = object;

        //Existence de los atributos requeridos
        if(name !== undefined && !name?.trim()){
            throw CustomError.badRequest('Nombre del producto es requerido');
        };

        let parsedPrice;
        if(price !== undefined){
            parsedPrice = Number(price);
            if(isNaN(Number(price))){
                throw CustomError.badRequest('Precio del producto debe ser un numero');
            };

            if(parsedPrice <= 0){
                throw CustomError.badRequest('Precio del producto debe ser mayor a 0.');
            };
        };

        let parsedStock;
        if(stock !== undefined){
            parsedStock = Number(stock);
            if(isNaN(parsedStock)){
                throw CustomError.badRequest('Stock del producto debe ser un numero');
            };

            if(parsedStock < 0){
                throw CustomError.badRequest('Stock del producto no puede ser menor a 0.');
            };
        };

        if(description !== undefined && description.length > 255){
            throw CustomError.badRequest('Descripcion del producto no puede ser mayor a 255 caracteres');
        };

        return new UpdateProductDto({
            name,
            description,
            price: parsedPrice,
            stock: parsedStock,
            img
        });
    };
};        