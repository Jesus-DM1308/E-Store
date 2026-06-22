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

    getAll = async ( req: Request, res: Response) => {
        return res.status(202).json({
            message: 'Get all Address of User by User Registered',
            address: 'STREETS',
            status: 'Not Implemented',
        });
    };

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
        return res.status(202).json({
            message: 'Update Address of User by User Registered',
            address: 'NEW STREET',
            status: 'Not Implemented',
        });
    };

    // NOT DELETE => HIDE OR ADDRESS BOOLEAN = FALSE
    deleteAddress = async (req: Request, res: Response) => {
        return res.status(202).json({
            message: 'Delete Address of User by User Registered',
            address: 'DELETED STREET',
            status: 'Not Implemented',
        });
    }

    testAddress = async (req: Request, res: Response) => {
        console.log('testAddress');
        res.status(202).json({
            message: 'Test Zone for Address',
        });
    }
}
