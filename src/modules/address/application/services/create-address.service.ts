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
            postal_code,
            user_id,
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

        if(!postal_code){
            throw CustomError.badRequest('Error en Postal code');
        };

        if(!user_id){
            throw CustomError.badRequest('Error en user_id');
        };
        
        return await this.AddressRepository.create( data );
    };
};
