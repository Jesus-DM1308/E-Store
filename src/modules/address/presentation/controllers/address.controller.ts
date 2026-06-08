import { Request, Response } from "express";
import { AddressEntity } from "../../domain/entity/address.entity.js";

export class AddressController {

    constructor() {}

    static getAll = async ( req: Request, res: Response) => {
        return res.status(202).json({
            message: 'Get all Address of User by User Registered',
            address: 'STREETS',
            status: 'Not Implemented',
        });
    };

    // GET USER DATA => VALIDATION => INSERT INTO DB
    static getAddress = async (req: Request, res: Response) => {

        return res.status(202).json({
            message: 'Get Address of User by User Registered',
            address1: 'STREET1',
            address2: 'STREET2',
            address3: 'STREET3',
            address4: 'STREET4',
            status: 'Not Implemented',
        });
    };

    // DATA: id, user_id, street, colony, references, postal_code, updatedAt, createdAt
    static createAddress = async (req: Request, res: Response) => {

        const {id, user_id, street, colony, references, postal_code} = req.body;
        const updatedAt = new Date();
        const createdAt = new Date();
        const addressEntity = new AddressEntity( id, user_id, street, colony, references, postal_code, updatedAt, createdAt);

        // SEND IT TO DTO

        return res.status(202).json(({
            message: 'Create Address of User',
            address: `Address Created: ${addressEntity}`,
            status: 'Not Implemented'
        }));
    };

    static updateAddress = async (req: Request, res: Response) => {
        return res.status(202).json({
            message: 'Update Address of User by User Registered',
            address: 'NEW STREET',
            status: 'Not Implemented',
        });
    };

    // NOT DELETE => HIDE OR ADDRESS BOOLEAN = FALSE
    static deleteAddress = async (req: Request, res: Response) => {
        return res.status(202).json({
            message: 'Delete Address of User by User Registered',
            address: 'DELETED STREET',
            status: 'Not Implemented',
        });
    }

    static testAddress = async (req: Request, res: Response) => {
        console.log('testAddress');
        res.status(202).json({
            message: 'Test Zone for Address',
        });
    }
}
