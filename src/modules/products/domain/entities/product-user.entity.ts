export class ProductUserEntity {
  constructor(
    public id: number,
    public userId: string,
    public productId: number,
    public price: number,
    public stock: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
