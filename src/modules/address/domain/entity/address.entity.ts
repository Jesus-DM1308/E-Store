export class AddressEntity{
    constructor( 
        public id: number,
        public user_id: string,         
        public street: string,
        public colony: string,
        public references: string,
        public postal_code: string,
        public updated_at: Date,        
        public created_at: Date,         
    ){};
};
