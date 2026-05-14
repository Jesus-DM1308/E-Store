import express, { Router } from 'express';

export class Server{
    public readonly app = express();
    private serverListener?: any;
    
    private readonly routes: Router;
    private readonly port: Number;
    private readonly publicPath: String;
    
    constructor( port: Number, publicPath: String = 'public', routes: Router){
        this.port = port;
        this.publicPath = publicPath;
        this.routes = routes;
    };

    async start(){
        //Middlewares

        //Routes
        this.app.use( this.routes );

        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port ${ this.port }`);
        });
    };

    public close() {
        this.serverListener?.close();
    };

};