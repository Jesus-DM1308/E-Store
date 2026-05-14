export class ProductEntity{

    constructor( 
        public id: number,
        public name: string,
        public description: string,
        public price: number,
        public stock: number,
        public img: string,
        public createdAt: Date,
        public updatedAt: Date 
    ) {};

    public static fromObject( object: {[key: string]: any} ): ProductEntity{
        const { id, name, description, price, stock, img, createdAt, updatedAt } = object;
        
        if( !id ) throw `id is required`;
        if( !name ) throw `name is required`;
        if( !price ) throw `price is required`;
        
        if( isNaN(createdAt.getTime()) ) throw `completedAt is not a valid date`;
        if( isNaN(updatedAt.getTime()) ) throw `updatedAt is not a valid date`;

        return new ProductEntity( id, name, description, price, stock, img, createdAt, updatedAt );

    };

};