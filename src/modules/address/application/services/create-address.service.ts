import { CustomError } from "../../../../shared/domain/index.js";
import { AddressRepository } from "../../domain/index.js";
import { CreateAddressDto } from "../index.js";

export class CreateAddressService{

    constructor(
        private readonly AddressRepository: AddressRepository,
    ){};

    async execute( data: CreateAddressDto){
        //Se desestrcutura desde el objeto data directamente
        const {
            street,
            colony,
            references,
            postal_code,
            updatedAt,
            createdAt,
        } = data.props;

        //Reglas de negocio
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
        
        return await this.AddressRepository.create( data );
    };
};