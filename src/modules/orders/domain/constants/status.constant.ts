import { OrderStatusCode } from './order-status.constant.js';

export { OrderStatusCode };

export const ORDER_STATUSES = Object.values(OrderStatusCode);

export const TRACKING_STATUS_FLOW = [
  OrderStatusCode.PENDING,
  OrderStatusCode.APPROVED,
  OrderStatusCode.SENDING,
  OrderStatusCode.IN_TRANSIT,
  OrderStatusCode.DELIVERED,
] as const;

export const CANCELLABLE_ORDER_STATUSES = [
  OrderStatusCode.PENDING,
  OrderStatusCode.APPROVED,
] as const;
