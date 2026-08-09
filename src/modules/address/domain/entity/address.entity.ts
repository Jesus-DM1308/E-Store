export class AddressEntity{
    constructor( 
        public id: number,
        public user_id: number,
        public street: string,
        public colony: string,
        public references: string,
        public postal_code: string,
        public updatedAt: Date,
        public createdAt: Date,
    ){};
};