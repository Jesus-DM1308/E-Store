import { OrderStatusCode } from '../constants/order-status.constant.js';

export interface SellerOrderDetail {
  id: number;
  productUserId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface SellerOrderSummary {
  id: number;
  statusId: number;
  statusCode: OrderStatusCode;
  user: {
    name: string;
    lastName: string;
    cel: string;
  };
  total: number;
  address: unknown;
  whoReceive: string;
  details: SellerOrderDetail[];
}

export interface SellerOrdersByStatus {
  pending: SellerOrderSummary[];
  approved: SellerOrderSummary[];
  sending: SellerOrderSummary[];
  inTransit: SellerOrderSummary[];
  delivered: SellerOrderSummary[];
  cancelled: SellerOrderSummary[];
  refunded: SellerOrderSummary[];
}
