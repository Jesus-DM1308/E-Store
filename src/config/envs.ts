import 'dotenv/config';
import env from 'env-var';

export const envs = {
    PORT: env.get('PORT').required().asIntPositive(),
    PUBLIC_PATH: env.get('PUBLIC_PATH').required().asString(),
    DATABASE_URL: env.get('DATABASE_URL').required().asString()
};