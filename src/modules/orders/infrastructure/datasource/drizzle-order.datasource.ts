import { and, eq, inArray, sql } from "drizzle-orm";
import { db, orderDetailTable, orderTable, productsTable, statusOrder } from "../../../../shared/infrastructure/index.js";
import { CustomError } from "../../../../shared/domain/index.js";
import { CreateOrderDto, UpdateOrderStatusDto } from "../../application/index.js";
import { OrderDatasource, OrderDetailEntity, OrderEntity, statusCode } from "../../domain/index.js";
import { OrderMapper } from "../mappers/order.mapper.js";
import { OrderDetailMapper } from "../mappers/order-detail.mapper.js";

const DEFAULT_ORDER_STATUS = statusCode.PENDING;
const CANCELLED_ORDER_STATUS = statusCode.CANCELLED;
const CANCELLABLE_ORDER_STATUSES = [
    statusCode.PENDING,
    statusCode.ACCEPTED,
    statusCode.PROCESSING
];

export class DrizzleOrderDatasource extends OrderDatasource {
    async getById(id: number): Promise<OrderEntity | null> {
        const [order] = await db.select()
            .from(orderTable)
            .where(eq(orderTable.id, id));

        if (!order) {
            return null;
        };

        return OrderMapper.toEntity(order);
    };

    async getAllByUserId(userId: string): Promise<OrderEntity[]> {
        const orders = await db.select()
            .from(orderTable)
            .where(eq(orderTable.userId, userId));

        return orders.map(order => OrderMapper.toEntity(order));
    };

    async getAll(): Promise<OrderEntity[]> {
        const orders = await db.select()
            .from(orderTable);

        return orders.map(order => OrderMapper.toEntity(order));
    };

    async getDetailsByOrderId(orderId: number): Promise<OrderDetailEntity[]> {
        const details = await db.select()
            .from(orderDetailTable)
            .where(eq(orderDetailTable.orderId, orderId));

        return details.map(detail => OrderDetailMapper.toEntity(detail));
    };

    async create(createOrderDto: CreateOrderDto): Promise<OrderEntity | null> {
        const {
            userId,
            address,
            deliveryDate,
            details
        } = createOrderDto.props;

        return db.transaction(async (tx) => {
            const productIds = details.map(detail => detail.productId);

            const [defaultStatus] = await tx.select()
                .from(statusOrder)
                .where(eq(statusOrder.code, DEFAULT_ORDER_STATUS));

            if (!defaultStatus) {
                throw CustomError.badRequest('Default order status is not configured');
            };

            const products = await tx.select()
                .from(productsTable)
                .where(and(
                    inArray(productsTable.id, productIds),
                    eq(productsTable.isActive, true)
                ));

            if (products.length !== productIds.length) {
                throw CustomError.badRequest('One or more products do not exist');
            };

            let total = 0;

            for (const detail of details) {
                const product = products.find(item => item.id === detail.productId);

                if (!product) {
                    throw CustomError.badRequest(`Product ${detail.productId} does not exist`);
                };

                if (product.stock < detail.quantity) {
                    throw CustomError.badRequest(`Product ${product.name} does not have enough stock`);
                };

                total += product.price * detail.quantity;
            };

            const [order] = await tx.insert(orderTable)
                .values({
                    statusId: defaultStatus.id,
                    userId,
                    total,
                    address,
                    ...(deliveryDate !== undefined ? { deliveryDate } : {})
                })
                .returning();

            if (!order) {
                return null;
            };

            for (const detail of details) {
                const product = products.find(item => item.id === detail.productId)!;

                await tx.insert(orderDetailTable)
                    .values({
                        orderId: order.id,
                        productId: detail.productId,
                        quantity: detail.quantity,
                        unitPrice: product.price
                    });

                await tx.update(productsTable)
                    .set({
                        stock: sql`${productsTable.stock} - ${detail.quantity}`,
                        updatedAt: new Date()
                    })
                    .where(eq(productsTable.id, detail.productId));
            };

            return OrderMapper.toEntity(order);
        });
    };

    async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderEntity | null> {
        const [status] = await db.select()
            .from(statusOrder)
            .where(eq(statusOrder.id, updateOrderStatusDto.props.statusId));

        if (!status) {
            throw CustomError.badRequest('Order status does not exist');
        };

        const [order] = await db.update(orderTable)
            .set({
                statusId: updateOrderStatusDto.props.statusId,
                updatedAt: new Date()
            })
            .where(eq(orderTable.id, id))
            .returning();

        if (!order) {
            return null;
        };

        return OrderMapper.toEntity(order);
    };

    async cancelById(id: number): Promise<OrderEntity | null> {
        const order = await db.transaction(async (tx) => {
            const statuses = await tx.select()
                .from(statusOrder)
                .where(inArray(statusOrder.code, [
                    ...CANCELLABLE_ORDER_STATUSES,
                    CANCELLED_ORDER_STATUS
                ]));

            const cancelledStatus = statuses.find(status => status.code === CANCELLED_ORDER_STATUS);

            if (!cancelledStatus) {
                throw CustomError.badRequest('Cancelled order status is not configured');
            };

            const cancellableStatusIds = statuses
                .filter(status => CANCELLABLE_ORDER_STATUSES.includes(status.code as typeof CANCELLABLE_ORDER_STATUSES[number]))
                .map(status => status.id);

            if (cancellableStatusIds.length !== CANCELLABLE_ORDER_STATUSES.length) {
                throw CustomError.badRequest('One or more cancellable order statuses are not configured');
            };

            const [updatedOrder] = await tx.update(orderTable)
                .set({
                    statusId: cancelledStatus.id,
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(orderTable.id, id),
                        inArray(orderTable.statusId, cancellableStatusIds)
                    )
                )
                .returning();

            if (!updatedOrder) {
                return null;
            };

            const details = await tx.select()
                .from(orderDetailTable)
                .where(eq(orderDetailTable.orderId, id));

            for (const detail of details) {
                await tx.update(productsTable)
                    .set({
                        stock: sql`${productsTable.stock} + ${detail.quantity}`,
                        updatedAt: new Date()
                    })
                    .where(eq(productsTable.id, detail.productId));
            };

            return updatedOrder;
        });

        if (!order) {
            return null;
        };

        return OrderMapper.toEntity(order);
    };

    async verifyOrderStatus( id: number ): Promise<string | null>{
        const [code] = await db.select({ 
            code: statusOrder.code 
        })  .from( statusOrder )
            .where( eq( statusOrder.id, id ) );
        return code?.code || null; 
    };
}
