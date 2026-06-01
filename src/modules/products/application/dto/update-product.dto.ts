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

        const updatedProduct: UpdateProductProps = {};

        if(name !== undefined){
            updatedProduct.name = name;
        };

        if(description !== undefined){
            updatedProduct.description = description;
        };

        if(img !== undefined){
            updatedProduct.img = img;
        };

        if(price !== undefined){
            const parsedPrice = Number(price);

            if(isNaN(parsedPrice)){
                throw CustomError.badRequest('Precio del producto debe ser un numero');
            };

            if(parsedPrice <= 0){
                throw CustomError.badRequest('Precio del producto debe ser mayor a 0.');
            };

            updatedProduct.price = parsedPrice;
        };

        if(stock !== undefined){
            const parsedStock = Number(stock);

            if(isNaN(parsedStock)){
                throw CustomError.badRequest('Stock del producto debe ser un numero');
            };

            if(parsedStock < 0){
                throw CustomError.badRequest('Stock del producto no puede ser menor a 0.');
            };

            updatedProduct.stock = parsedStock;
        };

        if(description !== undefined && description.length > 255){
            throw CustomError.badRequest('Descripcion del producto no puede ser mayor a 255 caracteres');
        };

        return new UpdateProductDto(updatedProduct);
    };
};  