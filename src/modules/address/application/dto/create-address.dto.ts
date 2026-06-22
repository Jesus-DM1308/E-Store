import { CustomError } from "../../../../shared/domain/index.js";

interface CreateProductProps{
    street: string,
    colony: string,
    references: string,
    postal_code: string,
    updatedAt: Date;
    createdAt: Date;
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
            updatedAt = new Date(),
            createdAt = new Date(),
        } = object;

        //Existence of Attributes
        if(!street || !colony || !references || !postal_code){
            throw CustomError.badRequest('LLenar Todos los Campos Solicitados');
        };

        if( typeof(street)      !== 'string' || 
            typeof(colony)      !== 'string' || 
            typeof(references)  !== 'string' || 
            typeof(postal_code) !== 'string'
        ){
            throw CustomError.badRequest('Error en Tipo de Datos');
        };

        if (street.length > 300 || colony.length > 300) {
            throw CustomError.badRequest('Calle y Colonia Deben ser Menor a 300 Caracteres');
        }

        if (!(postal_code.length === 5)) {
            throw CustomError.badRequest('Error en Postal code');
        }

        if (!updatedAt || !createdAt) {
            throw CustomError.badRequest('Error en UpdatedAt y CreatedAt dto')
        }

        return new CreateAddressDto({
            street,
            colony,
            references,
            postal_code,
            updatedAt,
            createdAt,
        });
    };
    
};