import { AddressEntity } from '../../domain/entity/address.entity.js';

export class AddressMapper {

    static toEntity( object: { [ key: string ]: any } ): AddressEntity{
        const {
            id,
            user_id,
            street,
            colony,
            references,
            postal_code,
            updated_at,
            created_at,
        } = object;

        return new AddressEntity(
            id,
            user_id,
            street,
            colony,
            references,
            postal_code,
            updated_at,   
            created_at,    
        );
    };
};
