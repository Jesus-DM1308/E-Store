import { OrderAddressEntity } from "../index.js";

export class ReportOrderEntity {
  constructor(
    public readonly id: number,
    public readonly total: number,
    public readonly status: number,
    public readonly deliveryDate: Date | null,
    public readonly createdAt: Date,
    public readonly address: OrderAddressEntity
  ) {}
}