import { CustomError } from '../../../../shared/domain/index.js';

export interface UpdateAddressProps{
    street?: string,
    colony?: string,
    references?: string,
    postalCode?: string,
};

export class UpdateAddressDto{

    private constructor(
        public readonly props: UpdateAddressProps
    ){};

    static create( object: {[key: string]: any}): UpdateAddressDto{
        const {
            street,
            colony,
            references,
            postalCode,
        } = object;

        const updatedAddress: UpdateAddressProps = {};

        if(street !== undefined){
            if(typeof street !== 'string' || !street.trim()){
                throw CustomError.badRequest('Street debe ser un texto valido');
            }
            if(street.length > 255){
                throw CustomError.badRequest('Street debe ser menor a 255 caracteres');
            }
            updatedAddress.street = street;
        };

        if(colony !== undefined){
            if(typeof colony !== 'string' || !colony.trim()){
                throw CustomError.badRequest('Colony debe ser un texto valido');
            }
            if(colony.length > 255){
                throw CustomError.badRequest('Colony debe ser menor a 255 caracteres');
            }
            updatedAddress.colony = colony;
        };

        if(references !== undefined){
            if(typeof references !== 'string' || !references.trim()){
                throw CustomError.badRequest('References debe ser un texto valido');
            }
            if(references.length > 255){
                throw CustomError.badRequest('References debe ser menor a 255 caracteres');
            }
            updatedAddress.references = references;
        };

        if(postalCode !== undefined){
            if(typeof postalCode !== 'string'){
                throw CustomError.badRequest('PostalCode debe ser un texto valido');
            }
            if(postalCode.length !== 5){
                throw CustomError.badRequest('PostalCode debe tener 5 digitos');
            }
            updatedAddress.postalCode = postalCode
        };

        if(Object.keys(updatedAddress).length === 0){
            throw CustomError.badRequest('Debe enviar al menos un campo para actualizar');
        }

        return new UpdateAddressDto(updatedAddress);
    };
};  
