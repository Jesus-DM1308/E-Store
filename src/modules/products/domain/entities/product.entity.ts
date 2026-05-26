export class ProductEntity{

    constructor( 
        public id: number,
        public name: string,
        public description: string,
        public price: number,
        public stock: number,
        public img: string,
        public created_at: Date,
        public updated_at: Date 
    ) {};

    public static fromObject( object: { [key: string]: any } ): ProductEntity{
        const { id, name, description, price, stock, img, created_at, updated_at } = object;
        if( !id ) throw `id is required`;
        if( !name ) throw `name is required`;
        if( !price ) throw `price is required`;

        if( isNaN(created_at.getTime()) ) throw `created_at is not a valid date`;
        if( isNaN(updated_at.getTime()) ) throw `updated_at is not a valid date`;

        return new ProductEntity( id, name, description, price, stock, img, created_at, updated_at );

    };

};