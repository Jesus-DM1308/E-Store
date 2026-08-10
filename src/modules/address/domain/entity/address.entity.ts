export class AddressEntity{
    constructor( 
        public id: number,
        public userId: string,
        public street: string,
        public colony: string,
        public references: string,
        public postalCode: string,
        public updatedAt: Date,
        public createdAt: Date,
    ){};
};
