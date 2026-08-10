import { CustomError } from "../../../../shared/domain/index.js";
import { AddressRepository } from "../../domain/index.js";
import { CreateAddressDto } from "../index.js";

export class CreateAddressService{

    constructor(
        private readonly AddressRepository: AddressRepository,
    ){};

    async execute( data: CreateAddressDto){
        const {
            street,
            colony,
            references,
            postalCode,
            userId,
        } = data.props;

        if(!street){
            throw CustomError.badRequest('Error en Street');
        };
        
        if(!colony){
            throw CustomError.badRequest('Error en Colony');
        };

        if(!references){
            throw CustomError.badRequest('Error en References');
        };

        if(!postalCode){
            throw CustomError.badRequest('Error en Postal code');
        };

        if(!userId){
            throw CustomError.badRequest('Error en userId');
        };
        
        return await this.AddressRepository.create( data );
    };
};
