import type { Request, Response } from "express";
import { CustomError } from "../../../../shared/domain/index.js";
import {
    CreateOrderDto,
    CreateOrderService,
    DeleteOrderService,
    GetOrderService,
    GetOrdersService,
    GetUserOrdersService,
    UpdateOrderStatusDto,
    UpdateOrderStatusService
} from "../../application/index.js";

type RequestWithUser = Request & {
    userTokenData?: {
        id: string;
        role: string;
    };
};

export class OrdersController {
    constructor(
        private readonly createOrderService: CreateOrderService,
        private readonly getOrdersService: GetOrdersService,
        private readonly getOrderService: GetOrderService,
        private readonly getUserOrdersService: GetUserOrdersService,
        private readonly updateOrderStatusService: UpdateOrderStatusService,
        private readonly deleteOrderService: DeleteOrderService
    ){};

    private getPositiveIntegerId(req: Request): number {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            throw CustomError.badRequest('Id de la orden no valida');
        };

        return id;
    };

    getAll = async (req: Request, res: Response) => {
        const orders = await this.getOrdersService.execute();

        return res.status(200).json(orders);
    };

    getMine = async (req: RequestWithUser, res: Response) => {
        const userId = req.userTokenData?.id;

        if (!userId) {
            throw CustomError.unauthorized('Usuario no autenticado');
        };

        const orders = await this.getUserOrdersService.execute(userId);

        return res.status(200).json(orders);
    };

    getById = async (req: RequestWithUser, res: Response) => {
        const id = this.getPositiveIntegerId(req);
        const order = await this.getOrderService.execute(id);

        const user = req.userTokenData;
        const canSeeOrder = user?.role === 'SELLER' || user?.role === 'ADMIN' || user?.id === order.userId;

        if (!canSeeOrder) {
            throw CustomError.forbidden('No puedes ver esta orden.');
        };

        return res.status(200).json(order);
    };

    create = async (req: RequestWithUser, res: Response) => {
        const userId = req.userTokenData?.id;

        if (!userId) {
            throw CustomError.unauthorized('Usuario no autenticado');
        };

        const dto = CreateOrderDto.create({
            ...req.body,
            userId
        });

        const order = await this.createOrderService.execute(dto);

        return res.status(201).json({
            message: 'La orden ha sido creada exitosamente.',
            order
        });
    };

    updateStatus = async (req: Request, res: Response) => {
        const id = this.getPositiveIntegerId(req);
        const dto = UpdateOrderStatusDto.create(req.body);
        const order = await this.updateOrderStatusService.execute(id, dto);

        return res.status(200).json({
            message: 'El estado de la orden ha sido actualizado exitosamente.',
            order
        });
    };

    deleteById = async (req: Request, res: Response) => {
        const id = this.getPositiveIntegerId(req);
        const order = await this.deleteOrderService.execute(id);

        return res.status(200).json({
            message: 'La orden ha sido eliminada exitosamente.',
            order
        });
    };
}
