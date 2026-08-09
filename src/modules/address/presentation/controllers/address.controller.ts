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

    // getAll = async ( req: Request, res: Response) => {
    //     return res.status(202).json({
    //         message: 'Get all Address of User by User Registered',
    //         address: 'STREETS',
    //     });
    // };

    // GET USER DATA => VALIDATION => INSERT INTO DB
    getAddress = async (req: Request, res: Response) => {

        return res.status(202).json({
            message: 'Get Address of User by User Registered',
            address1: 'STREET1',
            address2: 'STREET2',
            address3: 'STREET3',
            address4: 'STREET4',
        });
    };

    // DATA: id, user_id, street, colony, references, postal_code, updatedAt, createdAt
    createAddress = async (req: Request, res: Response) => {
        const dto = CreateAddressDto.create( req.body );

        const address = await this.createAddressService.execute(dto);
        res.status(201).json({
            message: 'La Dirección ha sido creado Exitosamente:',
            address: address,
        });
    };

    updateAddress = async (req: Request, res: Response) => {
        const id  = Number( req.params.id );
        if( isNaN( id ) ){
            throw CustomError.badRequest('Id de Address no valida')
        };

        const address = await this.updateAddressService.execute( id, req.body );
        res.status(200).json({
            message: 'La Dirección ha sido modificada Exitosamente:',
            address: address,    
        });
    };

    // NOT DELETE => HIDE OR ADDRESS BOOLEAN = FALSE
    deleteAddress = async (req: Request, res: Response) => {
        const id  = Number( req.params.id );
        if( isNaN( id ) ){
            throw CustomError.badRequest('Id de Address no valida')
        };

        const address = await this.deleteAddressService.execute( id );
        res.status( 200 ).json({
            message: 'La Dirección ha sido eliminado Exitosamente:',
            address: address,
        });
    }
}
