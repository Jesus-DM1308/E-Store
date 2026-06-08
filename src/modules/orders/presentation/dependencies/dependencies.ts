import {
    CreateOrderService,
    DeleteOrderService,
    GetOrderService,
    GetOrdersService,
    GetUserOrdersService,
    UpdateOrderStatusService
} from "../../application/index.js";
import { DrizzleOrderDatasource, OrderRepositoryImpl } from "../../infrastructure/index.js";
import { OrdersController } from "../index.js";

const datasource =
    new DrizzleOrderDatasource();

const repository =
    new OrderRepositoryImpl(datasource);

const createOrderService =
    new CreateOrderService(repository);

const getOrdersService =
    new GetOrdersService(repository);

const getOrderService =
    new GetOrderService(repository);

const getUserOrdersService =
    new GetUserOrdersService(repository);

const updateOrderStatusService =
    new UpdateOrderStatusService(repository);

const deleteOrderService =
    new DeleteOrderService(repository);

export const ordersController =
    new OrdersController(
        createOrderService,
        getOrdersService,
        getOrderService,
        getUserOrdersService,
        updateOrderStatusService,
        deleteOrderService
    );
