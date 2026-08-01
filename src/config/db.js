import { Pool } from 'pg';
import {app_env} from './env.js';

export const pool = new Pool({
    connectionString: app_env.db_connection_string
})