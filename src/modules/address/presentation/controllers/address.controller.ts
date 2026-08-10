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
        const userId = req.userTokenData.id;
        const addresses = await this.AddressRepository.getAllByUserId(userId);
        res.status(200).json(addresses);
    };

    
    getAddress = async (req: any, res: Response) => {
        const id = Number(req.params.id);
        if(isNaN(id)) throw CustomError.badRequest('Id de Address no valida');
        const address = await this.getAddressService.execute(id);

        if(address.userId !== req.userTokenData.id)
            throw CustomError.forbidden('No tienes acceso a esta direccion');

        res.status(200).json(address);
    };

    
    createAddress = async (req: any, res: Response) => {
        const userId = req.userTokenData?.id;
        if(!userId) throw CustomError.unauthorized('No autenticado');

        const dto = CreateAddressDto.create({ ...req.body, userId });

        const address = await this.createAddressService.execute(dto);
        res.status(201).json({
            message: 'La direccion ha sido creada exitosamente',
            address: address,
        });
    };

    updateAddress = async (req: any, res: Response) => {
        const id  = Number( req.params.id );
        if( isNaN( id ) ){
            throw CustomError.badRequest('Id de Address no valida')
        };

        const currentAddress = await this.getAddressService.execute(id);
        if(currentAddress.userId !== req.userTokenData.id){
            throw CustomError.forbidden('No tienes acceso a esta direccion');
        }

        const address = await this.updateAddressService.execute( id, req.body );
        res.status(200).json({
            message: 'La direccion ha sido modificada exitosamente',
            address: address,    
        });
    };

    deleteAddress = async (req: any, res: Response) => {
        const id  = Number( req.params.id );
        if( isNaN( id ) ){
            throw CustomError.badRequest('Id de Address no valida')
        };

        const currentAddress = await this.getAddressService.execute(id);
        if(currentAddress.userId !== req.userTokenData.id){
            throw CustomError.forbidden('No tienes acceso a esta direccion');
        }

        const address = await this.deleteAddressService.execute( id );
        res.status( 200 ).json({
            message: 'La direccion ha sido eliminada exitosamente',
            address: address,
        });
    }
}
