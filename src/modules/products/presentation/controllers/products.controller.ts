import { CreateProductService, UpdateProductService, DeleteProductService, GetProductService, CreateProductDto } from '../../application/index.js';
import { Request, Response } from 'express';
import { ProductRepository } from '../../domain/index.js';
import { CustomError } from '../../../../shared/domain/index.js';

export class ProductsController{
    constructor(
        private readonly createproductService: CreateProductService,
        private readonly updateProductService: UpdateProductService,
        private readonly deleteProductService: DeleteProductService,
        private readonly getProductService: GetProductService,
        private readonly productRepository: ProductRepository
    ){};

    getAll = async ( req: Request, res: Response ) => {
        const products = await this.productRepository.getAll();
        res.status(200).json(products);
    };

    getById = async ( req: Request, res: Response ) => {
        const id  = Number(req.params.id);
        if( isNaN(id) ){
            throw CustomError.badRequest('Id del producto no valida')
        };
        const product = await this.getProductService.execute( id );
        res.status(200).json(product);
    };

    create = async ( req: Request, res: Response ) => {
        const dto = CreateProductDto.create( req.body );

        const product = await this.createproductService.execute( dto );
        res.status(201).json({
            message: 'El producto ha sido creado exitosamente:',
            product: product
        });
    };

    updateById = async ( req: Request, res: Response ) => {
        const id  = Number( req.params.id );
        if( isNaN( id ) ){
            throw CustomError.badRequest('Id del producto no valida')
        };
        const product = await this.updateProductService.execute( id, req.body );
        res.status(200).json({
            message: 'El producto ha sido modificado exitosamente:',
            product: product    
        });
    };

    deleteById = async ( req: Request, res: Response ) => {
        const id  = Number( req.params.id );
        if( isNaN( id ) ){
            throw CustomError.badRequest('Id del producto no valida')
        };
        const product = await this.deleteProductService.execute( id );
        res.status( 200 ).json({
            message: 'El producto ha sido eliminado exitosamente:',
            product: product
        });
    };
};