import type { Request, Response } from 'express';
import { CustomError } from '../../../../shared/domain/index.js';
import {
  CreateOrderDto,
  CreateOrderService,
  DeleteOrderService,
  GetOrderService,
  GetSellerOrdersService,
  GetUserOrdersService,
  UpdateOrderStatusDto,
  UpdateOrderStatusService,
} from '../../application/index.js';

export class OrdersController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly getOrderService: GetOrderService,
    private readonly getUserOrdersService: GetUserOrdersService,
    private readonly getSellerOrdersService: GetSellerOrdersService,
    private readonly updateOrderStatusService: UpdateOrderStatusService,
    private readonly deleteOrderService: DeleteOrderService,
  ) {}

  private getPositiveIntegerId(req: Request): number {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw CustomError.badRequest('Id de la orden no valida.');
    }

    return id;
  }

  getAll = async (req: Request, res: Response) => {
    const userId = req.userTokenData?.id;

    if (!userId) {
      throw CustomError.unauthorized('Usuario no autenticado');
    }

    const orders = await this.getUserOrdersService.execute(userId);

    return res.status(200).json(orders);
  };

  getSellerOrders = async (req: Request, res: Response) => {
    const sellerId = req.userTokenData?.id;

    if (!sellerId) {
      throw CustomError.unauthorized('Usuario no autenticado');
    }

    const orders = await this.getSellerOrdersService.execute(sellerId);

    return res.status(200).json(orders);
  };

  getById = async (req: Request, res: Response) => {
    const id = this.getPositiveIntegerId(req);
    const order = await this.getOrderService.execute(id);

    const user = req.userTokenData;
    const canSeeOrder = user?.id === order.userId;

    if (!canSeeOrder) {
      throw CustomError.forbidden('No puedes ver esta orden.');
    }

    return res.status(200).json(order);
  };

  create = async (req: Request, res: Response) => {
    const userId = req.userTokenData?.id;

    if (!userId) {
      throw CustomError.unauthorized('Usuario no autenticado');
    }

    const dto = CreateOrderDto.create({
      ...req.body,
      userId,
    });

    const order = await this.createOrderService.execute(dto);

    return res.status(201).json({
      message: 'La orden ha sido creada exitosamente.',
      order,
    });
  };

  updateStatus = async (req: Request, res: Response) => {
    const id = this.getPositiveIntegerId(req);
    const sellerId = req.userTokenData?.id;

    if (!sellerId) {
      throw CustomError.unauthorized('Usuario no autenticado');
    }

    const dto = UpdateOrderStatusDto.create(req.body);
    const order = await this.updateOrderStatusService.execute(
      id,
      dto,
      sellerId,
    );

    return res.status(200).json({
      message: 'El estado de la orden ha sido actualizado exitosamente.',
      order,
    });
  };

  deleteById = async (req: Request, res: Response) => {
    const id = this.getPositiveIntegerId(req);
    const order = await this.deleteOrderService.execute(id);

    return res.status(200).json({
      message: 'La orden ha sido eliminada exitosamente.',
      order,
    });
  };
}
