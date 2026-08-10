import { AddressEntity } from '../../domain/entity/address.entity.js';

export class AddressMapper {

    static toEntity( object: { [ key: string ]: any } ): AddressEntity{
        const {
            id,
            userId,
            street,
            colony,
            references,
            postalCode,
            updatedAt,
            createdAt,
        } = object;

        return new AddressEntity(
            id,
            userId,
            street,
            colony,
            references,
            postalCode,
            updatedAt,
            createdAt,
        );
    };
};
