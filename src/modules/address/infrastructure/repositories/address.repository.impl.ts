import { CreateAddressDto, UpdateAddressDto } from "../../application/index.js";
import { AddressRepository, AddressDatasource, AddressEntity} from "../../domain/index.js";

export class AddressRepositoryImpl implements AddressRepository {
    constructor(
        private readonly AddressDatasource: AddressDatasource
    ){};

    async getById( id: number ): Promise<AddressEntity | null> {
        return this.AddressDatasource.getById( id );
    };

    async getAll( ): Promise<AddressEntity[]> {
        return this.AddressDatasource.getAll();
    };

    async create( createAddressDto: CreateAddressDto ): Promise<AddressEntity | null> {
       return this.AddressDatasource.create( createAddressDto );
    };

    async updateById( id: number, updateAddressDto: UpdateAddressDto ): Promise<AddressEntity | null> {
        return this.AddressDatasource.updateById( id, updateAddressDto );
    };

    async deleteById( id: number ): Promise<AddressEntity | null> {
        return this.AddressDatasource.deleteById( id );
    };

    async findByName( name: string): Promise<AddressEntity | null> {
        return this.AddressDatasource.findByName( name );
    }

}