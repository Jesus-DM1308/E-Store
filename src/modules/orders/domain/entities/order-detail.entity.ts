export class OrderDetailEntity {
  constructor(
    public id: number,
    public orderId: number,
    public productUserId: number,
    public quantity: number,
    public unitPrice: number,
    public updatedAt: Date,
    public createdAt: Date,
  ) {}
}
