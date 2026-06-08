import { CustomError } from "../../../../shared/domain/index.js";

interface CreateProductProps{
    street: string,
    colony: string,
    references: string,
    postal_code: string,
};

export class CreateAddressDto{
    private constructor(
        public readonly props: CreateProductProps
    ){};
    
    static create( object: {[key: string]: any}): CreateAddressDto{
        const {
            street,
            colony,
            references,
            postal_code,
        } = object;

        //Existence of Attributes
        if(!street || !colony || !references || !postal_code){
            throw CustomError.badRequest('LLenar Todos los Campos Solicitados');
        };
        if (street.length > 255 || colony.length > 255) {
            throw CustomError.badRequest('Calle y Colonia Deben ser Menor a 255 Caracteres');
        }
        if (!(postal_code.length === 5)) {
            throw CustomError.badRequest('Codigo Postal Debe ser Menor o Igual a 5 Caracteres');
        }

        return new CreateAddressDto({
            street,
            colony,
            references,
            postal_code,
        });
    };
    
};