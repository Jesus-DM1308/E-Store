import { CustomError } from "../../../../shared/domain/index.js";
import { AddressRepository } from "../../domain/index.js";

export class GetAddressService{

    constructor(
        private readonly AddressRepository: AddressRepository
    ){};

    async execute(id: number){

        const address = await this.AddressRepository.getById( id );
        if( !address ){
            throw CustomError.notFound('La id de Address ingresado no existe.')
        };

        return address;
    };
};