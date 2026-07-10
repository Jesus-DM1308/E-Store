import { and, eq, inArray, sql } from 'drizzle-orm';
import {
  db,
  orderDetailTable,
  ordersTable,
  productsTable,
  productsUsersTable,
  statusOrderTable,
} from '../../../../shared/infrastructure/index.js';
import { CustomError } from '../../../../shared/domain/index.js';
import { CreateOrderDto } from '../../application/index.js';
import {
  OrderDatasource,
  OrderDetailEntity,
  OrderEntity,
  OrderStatusCode,
} from '../../domain/index.js';
import { OrderMapper } from '../mappers/order.mapper.js';
import { OrderDetailMapper } from '../mappers/order-detail.mapper.js';

const DEFAULT_ORDER_STATUS = OrderStatusCode.PENDING;

export class DrizzleOrderDatasource extends OrderDatasource {
  async getById(id: number): Promise<OrderEntity | null> {
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id));

    if (!order) {
      return null;
    }

    return OrderMapper.toEntity(order);
  }

  async getAllByUserId(userId: string): Promise<OrderEntity[]> {
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, userId));

    return orders.map((order) => OrderMapper.toEntity(order));
  }

  async getAll(): Promise<OrderEntity[]> {
    const orders = await db.select().from(ordersTable);

    return orders.map((order) => OrderMapper.toEntity(order));
  }

  async getDetailsByOrderId(orderId: number): Promise<OrderDetailEntity[]> {
    const details = await db
      .select()
      .from(orderDetailTable)
      .where(eq(orderDetailTable.orderId, orderId));

    return details.map((detail) => OrderDetailMapper.toEntity(detail));
  }

  async getStatusIdByCode(statusCode: OrderStatusCode): Promise<number | null> {
    const [status] = await db
      .select({ id: statusOrderTable.id })
      .from(statusOrderTable)
      .where(eq(statusOrderTable.code, statusCode));

    return status?.id ?? null;
  }

  async getStatusCodeById(statusId: number): Promise<OrderStatusCode | null> {
    const [status] = await db
      .select({ code: statusOrderTable.code })
      .from(statusOrderTable)
      .where(eq(statusOrderTable.id, statusId));

    if (
      !status ||
      !Object.values(OrderStatusCode).includes(status.code as OrderStatusCode)
    ) {
      return null;
    }

    return status.code as OrderStatusCode;
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity | null> {
    const { userId, address, whoReceive, details } = createOrderDto.props;

    return db.transaction(async (tx) => {
      const productUserIds = details.map((detail) => detail.productUserId);

      const [defaultStatus] = await tx
        .select()
        .from(statusOrderTable)
        .where(eq(statusOrderTable.code, DEFAULT_ORDER_STATUS));

      if (!defaultStatus) {
        throw CustomError.badRequest(
          'El estado inicial de la orden no esta configurado.',
        );
      }

      const sellerProducts = await tx
        .select({
          id: productsUsersTable.id,
          productId: productsUsersTable.productId,
          price: productsUsersTable.price,
          stock: productsUsersTable.stock,
          productName: productsTable.name,
        })
        .from(productsUsersTable)
        .innerJoin(
          productsTable,
          eq(productsUsersTable.productId, productsTable.id),
        )
        .where(
          and(
            inArray(productsUsersTable.id, productUserIds),
            eq(productsTable.isActive, true),
          ),
        );

      if (sellerProducts.length !== productUserIds.length) {
        throw CustomError.badRequest(
          'Uno o mas productos del vendedor no existen.',
        );
      }

      let total = 0;

      for (const detail of details) {
        const sellerProduct = sellerProducts.find(
          (item) => item.id === detail.productUserId,
        );

        if (!sellerProduct) {
          throw CustomError.badRequest(
            `El producto del vendedor ${detail.productUserId} no existe.`,
          );
        }

        if (sellerProduct.stock < detail.quantity) {
          throw CustomError.badRequest(
            `El producto ${sellerProduct.productName} no tiene stock suficiente.`,
          );
        }

        total += sellerProduct.price * detail.quantity;
      }

      const [order] = await tx
        .insert(ordersTable)
        .values({
          statusId: defaultStatus.id,
          userId,
          total,
          address,
          whoReceive,
        })
        .returning();

      if (!order) {
        return null;
      }

      for (const detail of details) {
        const sellerProduct = sellerProducts.find(
          (item) => item.id === detail.productUserId,
        )!;

        await tx.insert(orderDetailTable).values({
          orderId: order.id,
          productUserId: detail.productUserId,
          quantity: detail.quantity,
          unitPrice: sellerProduct.price,
        });

        await tx
          .update(productsUsersTable)
          .set({
            stock: sql`${productsUsersTable.stock} - ${detail.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(productsUsersTable.id, detail.productUserId));
      }

      return OrderMapper.toEntity(order);
    });
  }

  async updateStatus(
    id: number,
    statusId: number,
    deliveryDate?: Date,
  ): Promise<OrderEntity | null> {
    const [order] = await db
      .update(ordersTable)
      .set({
        statusId,
        ...(deliveryDate !== undefined ? { deliveryDate } : {}),
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.id, id))
      .returning();

    if (!order) {
      return null;
    }

    return OrderMapper.toEntity(order);
  }

  async cancelById(
    id: number,
    cancelledStatusId: number,
  ): Promise<OrderEntity | null> {
    const order = await db.transaction(async (tx) => {
      const [updatedOrder] = await tx
        .update(ordersTable)
        .set({
          statusId: cancelledStatusId,
          updatedAt: new Date(),
        })
        .where(eq(ordersTable.id, id))
        .returning();

      if (!updatedOrder) {
        return null;
      }

      const details = await tx
        .select()
        .from(orderDetailTable)
        .where(eq(orderDetailTable.orderId, id));

      for (const detail of details) {
        await tx
          .update(productsUsersTable)
          .set({
            stock: sql`${productsUsersTable.stock} + ${detail.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(productsUsersTable.id, detail.productUserId));
      }

      return updatedOrder;
    });

    if (!order) {
      return null;
    }

    return OrderMapper.toEntity(order);
  }
}
