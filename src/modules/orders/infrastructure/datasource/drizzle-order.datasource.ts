import { and, eq, gte, inArray, sql } from 'drizzle-orm';
import {
  db,
  orderDetailTable,
  ordersTable,
  productsTable,
  productsUsersTable,
  statusOrderTable,
  usersTable,
} from '../../../../shared/infrastructure/index.js';
import { CustomError } from '../../../../shared/domain/index.js';
import { CreateOrderDto } from '../../application/index.js';
import {
  OrderDatasource,
  OrderDetailEntity,
  OrderEntity,
  OrderStatusCode,
  SellerOrdersByStatus,
  SellerOrderSummary,
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

  async getSellerOrdersByStatus(
    sellerId: string,
  ): Promise<SellerOrdersByStatus> {
    const rows = await db
      .select({
        orderId: ordersTable.id,
        statusId: ordersTable.statusId,
        statusCode: statusOrderTable.code,
        total: ordersTable.total,
        address: ordersTable.address,
        whoReceive: ordersTable.whoReceive,
        userName: usersTable.name,
        userLastName: usersTable.lastName,
        userCel: usersTable.cel,
        detailId: orderDetailTable.id,
        productUserId: orderDetailTable.productUserId,
        productId: productsUsersTable.productId,
        productName: productsTable.name,
        quantity: orderDetailTable.quantity,
        unitPrice: orderDetailTable.unitPrice,
      })
      .from(orderDetailTable)
      .innerJoin(ordersTable, eq(orderDetailTable.orderId, ordersTable.id))
      .innerJoin(usersTable, eq(ordersTable.userId, usersTable.id))
      .innerJoin(
        statusOrderTable,
        eq(ordersTable.statusId, statusOrderTable.id),
      )
      .innerJoin(
        productsUsersTable,
        eq(orderDetailTable.productUserId, productsUsersTable.id),
      )
      .innerJoin(
        productsTable,
        eq(productsUsersTable.productId, productsTable.id),
      )
      .where(
        eq(productsUsersTable.userId, sellerId),
      );

    const ordersById = new Map<number, SellerOrderSummary>();

    for (const row of rows) {
      const statusCode = row.statusCode as OrderStatusCode;
      const order = ordersById.get(row.orderId);

      if (order) {
        order.details.push({
          id: row.detailId,
          productUserId: row.productUserId,
          productId: row.productId,
          productName: row.productName,
          quantity: row.quantity,
          unitPrice: row.unitPrice,
        });
        continue;
      }

      ordersById.set(row.orderId, {
        id: row.orderId,
        statusId: row.statusId,
        statusCode,
        user: {
          name: row.userName,
          lastName: row.userLastName,
          cel: row.userCel,
        },
        total: row.total,
        address: row.address,
        whoReceive: row.whoReceive,
        details: [
          {
            id: row.detailId,
            productUserId: row.productUserId,
            productId: row.productId,
            productName: row.productName,
            quantity: row.quantity,
            unitPrice: row.unitPrice,
          },
        ],
      });
    }

    const sellerOrders: SellerOrdersByStatus = {
      pending: [],
      approved: [],
      sending: [],
      inTransit: [],
      delivered: [],
      cancelled: [],
      refunded: [],
    };

    for (const order of ordersById.values()) {
      if (order.statusCode === OrderStatusCode.PENDING) {
        sellerOrders.pending.push(order);
      }

      if (order.statusCode === OrderStatusCode.APPROVED) {
        sellerOrders.approved.push(order);
      }

      if (order.statusCode === OrderStatusCode.SENDING) {
        sellerOrders.sending.push(order);
      }

      if (order.statusCode === OrderStatusCode.IN_TRANSIT) {
        sellerOrders.inTransit.push(order);
      }

      if (order.statusCode === OrderStatusCode.DELIVERED) {
        sellerOrders.delivered.push(order);
      }

      if (order.statusCode === OrderStatusCode.CANCELLED) {
        sellerOrders.cancelled.push(order);
      }

      if (order.statusCode === OrderStatusCode.REFUNDED) {
        sellerOrders.refunded.push(order);
      }
    }

    return sellerOrders;
  }

  async isSellerAssignedToOrder(
    orderId: number,
    sellerId: string,
  ): Promise<boolean> {
    const [sellerOrder] = await db
      .select({ id: orderDetailTable.id })
      .from(orderDetailTable)
      .innerJoin(
        productsUsersTable,
        eq(orderDetailTable.productUserId, productsUsersTable.id),
      )
      .where(
        and(
          eq(orderDetailTable.orderId, orderId),
          eq(productsUsersTable.userId, sellerId),
        ),
      )
      .limit(1);

    return !!sellerOrder;
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

        const [updatedSellerProduct] = await tx
          .update(productsUsersTable)
          .set({
            stock: sql`${productsUsersTable.stock} - ${detail.quantity}`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(productsUsersTable.id, detail.productUserId),
              gte(productsUsersTable.stock, detail.quantity),
            ),
          )
          .returning();

        if (!updatedSellerProduct) {
          throw CustomError.badRequest(
            `El producto ${sellerProduct.productName} no tiene stock suficiente.`,
          );
        }
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
