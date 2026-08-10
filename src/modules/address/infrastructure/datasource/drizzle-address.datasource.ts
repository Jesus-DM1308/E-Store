import { eq } from "drizzle-orm";
import { db, addressTable } from "../../../../shared/infrastructure/index.js";
import { AddressEntity, AddressDatasource } from "../../domain/index.js";
import { CreateAddressDto, UpdateAddressDto } from "../../application/index.js";
import { AddressMapper } from "../mappers/address.mapper.js";

export class DrizzleAddressDataSource extends AddressDatasource {

    async getById( id: number ): Promise<AddressEntity | null> {
        const [address] = await db.select()
                                .from( addressTable )
                                .where(eq(addressTable.id, id));
        if (!address) {
            return null;
        };
        return AddressMapper.toEntity(address);
    };

    async getAllByUserId( userId: string ): Promise<AddressEntity[]> {
        const addresses = await db
            .select()
            .from(addressTable)
            .where(eq(addressTable.userId, userId));
        return addresses.map(AddressMapper.toEntity);
    };

    async getAll( ): Promise<AddressEntity[]> {
        const allAddress = await db.select()
                                    .from( addressTable );
        return allAddress.map( address => AddressMapper.toEntity(address));
    };

    async create( createAddressDto: CreateAddressDto ): Promise<AddressEntity | null> {
        
        const [address] = await db.insert( addressTable )
                                .values(createAddressDto.props)
                                .returning();
        if (!address) {
            return null;
        }
        return AddressMapper.toEntity( address );
    };

    async updateById( id: number, updateAddressDto: UpdateAddressDto ): Promise<AddressEntity | null> {
        const [address] = await db.update( addressTable )
                                .set({
                                    ...updateAddressDto.props,
                                    updatedAt: new Date()
                                })
                                .where(eq( addressTable.id, id))
                                .returning();
        if (!address) {
            return null;
        };
        return AddressMapper.toEntity( address );
    };

    async deleteById( id: number ): Promise<AddressEntity | null> {
        const [address] = await db.delete( addressTable )
                                .where(eq( addressTable.id, id))
                                .returning();
        if (!address) {
            return null;
        };
        return AddressMapper.toEntity( address );
    };

    async findByName( name: string ): Promise<AddressEntity | null>{
        const [address] = await db.select()
                                .from( addressTable )
                                .where(eq( addressTable.street, name));
        if (!address) {
            return null;
        }
        return AddressMapper.toEntity( address );

    };


};
