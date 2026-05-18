import { Server } from './app/server.ts';
import { envs } from './config/envs.ts';
import { AppRoutes } from './app/routes/routes.ts';

(async () => {
    main();
})();

async function main(){

    const appRoutes = AppRoutes.routes;

    const server = new Server(
        envs.PORT,
        envs.PUBLIC_PATH,
        appRoutes
    );

    console.log(process.env.DATABASE_URL);

    server.start();
}