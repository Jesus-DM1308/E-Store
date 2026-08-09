import { CreateAddressService, UpdateAddressService, DeleteAddressService, GetAddressService, CreateAddressDto } from "../../application/index.js";
import { Request, Response } from "express";
import { AddressRepository } from "../../domain/index.js";
import { CustomError } from "../../../../shared/domain/index.js";

export class AddressController {

    constructor(
        private readonly createAddressService: CreateAddressService,
        private readonly updateAddressService: UpdateAddressService,
        private readonly deleteAddressService: DeleteAddressService,
        private readonly getAddressService: GetAddressService,
        private readonly AddressRepository: AddressRepository
    ) {}

    
    getAll = async (req: any, res: Response) => {
        const user_id = req.userTokenData.id;
        const addresses = await this.AddressRepository.getAllByUserId(user_id);
        res.status(200).json(addresses);
    };

    
    getAddress = async (req: any, res: Response) => {
        const id = Number(req.params.id);
        if(isNaN(id)) throw CustomError.badRequest('Id de Address no válida');
        const address = await this.getAddressService.execute(id);

        if(address.user_id !== req.userTokenData.id)
            throw CustomError.forbidden('No tienes acceso a esta dirección');

        res.status(200).json(address);
    };

    
    createAddress = async (req: any, res: Response) => {
        const user_id = req.userTokenData?.id;  
        if(!user_id) throw CustomError.unauthorized('No autenticado');

        const dto = CreateAddressDto.create({ ...req.body, user_id });

        const address = await this.createAddressService.execute(dto);
        res.status(201).json({
            message: 'La dirección ha sido creada exitosamente',
            address: address,
        });
    };

    updateAddress = async (req: Request, res: Response) => {
        const id  = Number( req.params.id );
        if( isNaN( id ) ){
            throw CustomError.badRequest('Id de Address no válida')
        };

        const address = await this.updateAddressService.execute( id, req.body );
        res.status(200).json({
            message: 'La dirección ha sido modificada exitosamente',
            address: address,    
        });
    };

    deleteAddress = async (req: Request, res: Response) => {
        const id  = Number( req.params.id );
        if( isNaN( id ) ){
            throw CustomError.badRequest('Id de Address no válida')
        };

        const address = await this.deleteAddressService.execute( id );
        res.status( 200 ).json({
            message: 'La dirección ha sido eliminada exitosamente',
            address: address,
        });
    }
}
