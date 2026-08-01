import dotenv from 'dotenv';

dotenv.config();

export const app_env = {
    db_connection_string: process.env.DATABASE_URL,
    port: process.env.PORT,
}