import { CustomError } from "../../../../shared/domain/index.js";

interface CreateProductProps{
    name: string,
    description: string,
    price: number,
    stock: number,
    img: string
};

export class CreateProductDto{
    private constructor(
        public readonly props: CreateProductProps
    ){};
    
    static create( object: {[key: string]: any}): CreateProductDto{
        const {
            name,
            description,
            price,
            stock,
            img
        } = object;

        //Existence of attributes requires
        if(!name?.trim()){
            throw CustomError.badRequest('Nombre del producto es requerido');
        };
        if(price === undefined){
            throw CustomError.badRequest('Precio del producto es requerido');
        };
        if(stock === undefined){
            throw CustomError.badRequest('Stock del producto es requerido');
        };
        

        //Parsings
        const parsedPrice = Number(price);

        if(isNaN(parsedPrice)){
            throw CustomError.badRequest('Precio del producto debe ser un numero');
        };

        const parsedStock = Number(stock);

        if(isNaN(parsedStock)){
            throw CustomError.badRequest('Stock del producto debe ser un numero');
        };

        return new CreateProductDto({
            name,
            description,
            price: parsedPrice,
            stock: parsedStock,
            img
        });
    };
    
};