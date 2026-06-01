export class OrderDetailEntity{
    constructor(
        public id: number,
        public orderId: number,
        public productId: number,
        public quantity: number,
        public unitPrice: number,
        public updatedAt: Date,
        public createdAt: Date
    ){};
};