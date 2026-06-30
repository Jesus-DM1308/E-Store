import { CustomError } from "../../../../shared/domain/index.js";

interface CreateAddressProps{
    street: string,
    colony: string,
    references: string,
    postal_code: string,
    user_id: string,
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
            postal_code,
            user_id, 
        } = object;

        if(!street || !colony || !references || !postal_code){
            throw CustomError.badRequest('Llenar Todos los Campos Solicitados');
        };

        if(!user_id){
            throw CustomError.badRequest('user_id es requerido');
        };

        if( typeof(street)      !== 'string' || 
            typeof(colony)      !== 'string' || 
            typeof(references)  !== 'string' || 
            typeof(postal_code) !== 'string'
        ){
            throw CustomError.badRequest('Error en Tipo de Datos');
        };

        if (street.length > 255 || colony.length > 255) { 
            throw CustomError.badRequest('Calle y Colonia deben ser menor a 255 caracteres');
        }

        if (!(postal_code.length === 5)) {
            throw CustomError.badRequest('El código postal debe tener 5 dígitos');
        }

        return new CreateAddressDto({
            street,
            colony,
            references,
            postal_code,
            user_id,
        });
    };
    
};
