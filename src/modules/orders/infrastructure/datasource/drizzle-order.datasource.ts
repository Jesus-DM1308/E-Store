import { and, eq, inArray, sql } from "drizzle-orm";
import { db, orderDetailTable, orderTable, productsTable, statusOrder } from "../../../../shared/infrastructure/index.js";
import { CustomError } from "../../../../shared/domain/index.js";
import { CreateOrderDto, UpdateOrderStatusDto } from "../../application/index.js";
import { OrderDatasource, OrderDetailEntity, OrderEntity } from "../../domain/index.js";
import { OrderMapper } from "../mappers/order.mapper.js";
import { OrderDetailMapper } from "../mappers/order-detail.mapper.js";

const DEFAULT_ORDER_STATUS = 'Pendiente';

export class DrizzleOrderDatasource extends OrderDatasource {
    async getAll(): Promise<OrderEntity[]> {
        const orders = await db.select()
            .from(orderTable);

        return orders.map(order => OrderMapper.toEntity(order));
    };

    async getById(id: number): Promise<OrderEntity | null> {
        const [order] = await db.select()
            .from(orderTable)
            .where(eq(orderTable.id, id));

        if (!order) {
            return null;
        };

        return OrderMapper.toEntity(order);
    };

    async getByUserId(userId: string): Promise<OrderEntity[]> {
        const orders = await db.select()
            .from(orderTable)
            .where(eq(orderTable.user_id, userId));

        return orders.map(order => OrderMapper.toEntity(order));
    };

    async getDetailsByOrderId(orderId: number): Promise<OrderDetailEntity[]> {
        const details = await db.select()
            .from(orderDetailTable)
            .where(eq(orderDetailTable.order_id, orderId));

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
                .where(eq(statusOrder.status, DEFAULT_ORDER_STATUS));

            if (!defaultStatus) {
                throw CustomError.badRequest('Default order status is not configured');
            };

            const products = await tx.select()
                .from(productsTable)
                .where(and(
                    inArray(productsTable.id, productIds),
                    eq(productsTable.is_active, true)
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
                    status: defaultStatus.id,
                    user_id: userId,
                    total,
                    address,
                    ...(deliveryDate !== undefined ? { delivery_date: deliveryDate } : {})
                })
                .returning();

            if (!order) {
                return null;
            };

            for (const detail of details) {
                const product = products.find(item => item.id === detail.productId)!;

                await tx.insert(orderDetailTable)
                    .values({
                        order_id: order.id,
                        product_id: detail.productId,
                        quantity: detail.quantity,
                        unit_price: product.price
                    });

                await tx.update(productsTable)
                    .set({
                        stock: sql`${productsTable.stock} - ${detail.quantity}`,
                        updated_at: new Date()
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
                status: updateOrderStatusDto.props.statusId,
                updated_at: new Date()
            })
            .where(eq(orderTable.id, id))
            .returning();

        if (!order) {
            return null;
        };

        return OrderMapper.toEntity(order);
    };

    async deleteById(id: number): Promise<OrderEntity | null> {
        return db.transaction(async (tx) => {
            await tx.delete(orderDetailTable)
                .where(eq(orderDetailTable.order_id, id));

            const [order] = await tx.delete(orderTable)
                .where(eq(orderTable.id, id))
                .returning();

            if (!order) {
                return null;
            };

            return OrderMapper.toEntity(order);
        });
    };
}
