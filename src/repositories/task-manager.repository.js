import { pool } from '../config/db.js';
import { app_env } from '../config/env.js';

const TABLE = app_env.task_table;

export const insertValuesToTable = async (title, description, status, priority, dueDate) => {
    try {
        const QUERY = `INSERT INTO ${TABLE}(title, description, status, priority, due_date) 
                        VALUES ($1, $2, $3, $4, $5) 
                        RETURNING *`;

        const VALUES = [title, description ?? '', status, priority, dueDate ?? null]

        const result = await pool.query(QUERY, VALUES);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Failed to insert task: ${error.message}`);
    }
};

export const updateValuesToTable = async (title, description, status, priority, dueDate) => {
    try {

        const QUERY = `UPDATE ${TABLE}(title, description, status, priority, due_date)
                        VALUES($1, $2, $3, $4, $5)
                        RETURNING *`

        const VALUES = [title, description ?? '', status, priority, dueDate ?? null];

        const result = await pool.query(QUERY, VALUES);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Failed to insert task: ${error.message}`);
    }
};

export const deleteFromTable = async (id) => {
    if (!id) {
        throw new Error('Invalid ID:' + id);
    };

    const QUERY = `DELETE FROM ${TABLE} WHERE id = $1 RETURNING *`;

    const result = await pool.query(QUERY, [id]);

    return result.rows[0];
};

export const getATasksFromTable = async (orderBy = 'ASC', sortBy = 'title', limit = 10, offset = 0) => {
    const QUERY = `SELECT * FROM ${TABLE} 
                   ORDER BY ${sortBy} ${orderBy} 
                   LIMIT $1 OFFSET $2`
        ;

    const result = await pool.query(QUERY, [limit, offset]);

    return result.rows;
};

export const getTaskByIdFromTable = async (id) => {
    const QUERY = `SELECT * FROM ${TABLE} WHERE id = $1`;
    const result = await pool.query(QUERY, [id]);

    return result.rows[0];
}