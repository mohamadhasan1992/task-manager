import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { 
    NODE_ENV, 
    PORT, 
    DB_HOST, 
    DB_PORT, 
    DB_DATABASE, 
    SECRET_KEY, 
    LOG_FORMAT, 
    LOG_DIR, 
    ORIGIN

} = process.env;
