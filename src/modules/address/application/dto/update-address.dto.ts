import { CustomError } from '../../../../shared/domain/index.js';

export interface UpdateAddressProps{
    street?: string,
    colony?: string,
    references?: string,
    postal_code?: string,
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
            postal_code,
        } = object;

        const updatedAddress: UpdateAddressProps = {};

        if(street !== undefined){
            updatedAddress.street = street;
        };

        if(colony !== undefined){
            updatedAddress.colony = colony;
        };

        if(references !== undefined){
            updatedAddress.references = references;
        };

        if(postal_code !== undefined){
            updatedAddress.postal_code = postal_code
        };

        return new UpdateAddressDto(updatedAddress);
    };
};  