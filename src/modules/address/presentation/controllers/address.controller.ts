import { Request, Response, NextFunction } from "express";
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
    static getById = async (req: Request, res: Response) => {
        return res.status(202).json({
            message: 'Get Address of User by User Registered',
            address: 'STREET',
            status: 'Not Implemented',
        });
    };

    static create = async (req: Request, res: Response) => {
        return res.status(202).json(({
            message: 'Create Address of User',
            address: 'CREATED STREET',
            status: 'Not Implemented'
        }));
    };

    static updateById = async (req: Request, res: Response) => {
        return res.status(202).json({
            message: 'Update Address of User by User Registered',
            address: 'NEW STREET',
            status: 'Not Implemented',
        });
    };

    static deleteById = async (req: Request, res: Response) => {
        return res.status(202).json({
            message: 'Delete Address of User by User Registered',
            address: 'DELETED STREET',
            status: 'Not Implemented',
        });
    };
};