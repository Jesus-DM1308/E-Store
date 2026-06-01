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
    ){};
};