import { Server } from './app/server.js';
import { envs } from './config/envs.js';
import { AppRoutes } from './app/routes/routes.js';

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

    server.start();
}