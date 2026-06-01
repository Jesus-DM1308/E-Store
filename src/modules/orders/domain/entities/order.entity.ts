export class OrderEntity{
    constructor(
        public id: number,
        public addressId: number,
        public userId: string,
        public total: number,
        public status: string,
        public orderDate: Date,
        public updatedAt: Date,
        public createdAt: Date,
    ){};
};