import { CustomError } from "../../../../shared/domain/index.js";

interface CreateAddressProps{
    street: string,
    colony: string,
    references: string,
    postalCode: string,
    userId: string,
};

export class CreateAddressDto{
    private constructor(
        public readonly props: CreateAddressProps
    ){};
    
    static create( object: {[key: string]: any}): CreateAddressDto{
        const {
            street,
            colony,
            references,
            postalCode,
            userId,
        } = object;

        if(!street || !colony || !references || !postalCode){
            throw CustomError.badRequest('Llenar Todos los Campos Solicitados');
        };

        if(!userId){
            throw CustomError.badRequest('userId es requerido');
        };

        if( typeof(street)      !== 'string' || 
            typeof(colony)      !== 'string' || 
            typeof(references)  !== 'string' || 
            typeof(postalCode) !== 'string'
        ){
            throw CustomError.badRequest('Error en Tipo de Datos');
        };

        if (street.length > 255 || colony.length > 255) { 
            throw CustomError.badRequest('Calle y Colonia deben ser menor a 255 caracteres');
        }

        if (!(postalCode.length === 5)) {
            throw CustomError.badRequest('El código postal debe tener 5 dígitos');
        }

        return new CreateAddressDto({
            street,
            colony,
            references,
            postalCode,
            userId,
        });
    };
    
};
