export class ProductEntity{
    constructor( 
        public id: number,
        public name: string,
        public brand: string,
        public description: string,
        public image: string,
        public isActive: boolean,
        public deletedAt: Date,
        public createdAt: Date,
        public updatedAt: Date 
    ){};
};