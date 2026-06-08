import { Request, Response, NextFunction } from "express";
import { AddressEntity } from "../../domain/entity/address.entity.js";

export class AddressController {

    constructor() {}

    // GET USER DATA => VALIDATION => INSERT INTO DB
    static getAddress = async (req: Request, res: Response) => {
        return res.status(202).json({
            message: 'Get Address of User by User Registered',
            address: 'STREET',
            status: 'Not Implemented',
        });
    }

    static createAddress = async (req: Request, res: Response) => {
        return res.status(202).json(({
            message: 'Create Address of User',
            address: 'CREATED STREET',
            status: 'Not Implemented'
        }));
    }

    static updateAddress = async (req: Request, res: Response) => {
        return res.status(202).json({
            message: 'Update Address of User by User Registered',
            address: 'NEW STREET',
            status: 'Not Implemented',
        });
    }

    static deleteAddress = async (req: Request, res: Response) => {
        return res.status(202).json({
            message: 'Delete Address of User by User Registered',
            address: 'DELETED STREET',
            status: 'Not Implemented',
        });
    }
}