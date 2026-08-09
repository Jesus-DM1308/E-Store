import { CustomError } from "../../../../shared/domain/index.js";
import { AddressRepository } from "../../domain/index.js";
import { UpdateAddressDto } from "../index.js";

export class UpdateAddressService{

    constructor(
        private readonly AddressRepository: AddressRepository
    ){};

    async execute(id: number, body: { [key: string]: any } ){

        const address = await this.AddressRepository.getById(id);
        if( !address ){
            throw CustomError.notFound('La id de Address ingresado no existe.');
        };

        const data = UpdateAddressDto.create(body);

        return await this.AddressRepository.updateById(id, data);
    };
};
