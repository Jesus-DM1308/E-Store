export class OrderEntity{
    constructor(
        public id: number,
        public statusId: number,
        public userId: string,
        public total: number,
        public address: unknown,
        public deliveryDate: Date | null,
        public updatedAt: Date,
        public createdAt: Date,
    ){};
};
