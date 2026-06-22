import express, { Router } from 'express';
import { errorMiddleware } from '../shared/infrastructure/http/middlewares/error.middleware.js';

export class Server{
    public readonly app = express();
    private serverListener?: any;
    
    private readonly routes: Router;
    private readonly port: number;
    private readonly publicPath: string;
    
    constructor( port: number, publicPath: string = 'public', routes: Router){
        this.port = port;
        this.publicPath = publicPath;
        this.routes = routes;
    };

    async start(){

        this.app.use(express.json());
        this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded

        //Routes
        this.app.use( this.routes );

        //Middlewares
       this.app.use(errorMiddleware);

        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port ${ this.port }`);
        });
    };

    public close() {
        this.serverListener?.close();
    };

};