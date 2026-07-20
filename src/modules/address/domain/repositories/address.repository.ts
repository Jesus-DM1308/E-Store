import type { AddressEntity } from "../entity/address.entity.js";
import { CreateAddressDto, UpdateAddressDto } from '../../application/index.js';

export abstract class AddressRepository {
    abstract getById( id: number ): Promise<AddressEntity | null>;
    abstract getAllByUserId( user_id: string ): Promise<AddressEntity[]>;
    abstract getAll( ): Promise<AddressEntity[]>;
    abstract create( createAddressDto: CreateAddressDto): Promise<AddressEntity | null>;
    abstract updateById( id: number, updateAddressDto :UpdateAddressDto ): Promise<AddressEntity | null>;
    abstract deleteById( id: number ): Promise<AddressEntity | null>;
    abstract findByName( name: string ): Promise<AddressEntity | null>;
}