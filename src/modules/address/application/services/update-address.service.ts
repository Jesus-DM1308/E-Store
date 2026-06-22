import { CustomError } from "../../../../shared/domain/index.js";
import { AddressRepository } from "../../domain/index.js";
import { UpdateAddressDto } from "../index.js";

export class UpdateAddressService{

    constructor(
        private readonly AddressRepository: AddressRepository
    ){};

    async execute(id: number, body: { [key: string]: any } ){

        //Verificar existencia de Address en la base de datos
        const address = await this.AddressRepository.getById(id);
        if( !address ){
            throw CustomError.badRequest('La id de Address ingresado no existe.')
        };

        const data = UpdateAddressDto.create(body);
        const {
            street,
            colony,
            references,
            postal_code,
        } = data.props;

        if( street !== undefined ){
            const nameExists = await this.AddressRepository.findByName(street);
            //Evitar duplicado de nombre validando que no se compare asi mismo
            if( nameExists?.street === name && nameExists.id !== id){
                throw CustomError.conflict('Nombre del producto ya existe.');
            };
        };

        return await this.AddressRepository.updateById(id, data);
    };
};