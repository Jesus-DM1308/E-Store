import { CustomError } from "../../../../shared/domain/index.js";
import { AddressRepository } from "../../domain/index.js";

export class DeleteAddressService{

    constructor(
        private readonly AddressRepository: AddressRepository
    ){};

    async execute(id: number){

        const idExist = await this.AddressRepository.getById( id );
        if( !idExist ){
            throw CustomError.notFound('La id de Address ingresado no existe.')
        };

        return await this.AddressRepository.deleteById( id );
    };
};