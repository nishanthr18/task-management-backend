import { pool } from '../config/db.js';
import { app_env } from '../config/env.js';

const TABLE = app_env.task_table;

const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const VALID_ORDERBY = ['ASC', 'DESC'];

const validate = (status = 'TODO', priority = 'LOW') => {
    const STATUS = status.toUpperCase();
    const PRIORITY = priority.toUpperCase();

    if (!VALID_STATUSES.includes(STATUS)) {
        throw new Error(`Invalid status: "${status}". Allowed values: ${VALID_STATUSES.join(', ')}`);
    }

    if (!VALID_PRIORITIES.includes(PRIORITY)) {
        throw new Error(`Invalid priority: "${priority}". Allowed values: ${VALID_PRIORITIES.join(', ')}`);
    }

    return { STATUS, PRIORITY };
};

export const insertValuesToTable = (title, description, status, priority, dueDate) => {
    try {
        const { STATUS, PRIORITY } = validate(status, priority);

        const QUERY = `INSERT INTO ${TABLE}(title, description, status, priority, due_date) 
                        VALUES ($1, $2, $3, $4, $5) 
                        RETURNING *`;

        const VALUES = [title, description ?? '', STATUS, PRIORITY, dueDate ?? null]

        const result = await pool.query(QUERY, VALUES);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Failed to insert task: ${error.message}`);
    }

};

export const updateValuesToTable = (title, description, status, priority, dueDate) => {
    try {
        const { STATUS, PRIORITY } = validate(status, priority);

        const QUERY = `UPDATE ${TABLE}(title, description, status, priority, due_date)
                        VALUES($1, $2, $3, $4, $5)
                        RETURNING *`

        const VALUES = [title, description ?? '', STATUS, PRIORITY, dueDate ?? null];

        const result = await pool.query(QUERY, VALUES);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Failed to insert task: ${error.message}`);
    }
};

export const deleteFromTable = (id) => {
    if (!id) {
        throw new Error('Invalid ID:' + id);
    };

    const QUERY = `DELETE FROM ${TABLE} WHERE id = $1 RETURNING *`;

    const result = pool.query(QUERY, [id]);

    return result.rows[0];
};

export const getAllTasksFromTable = () => {
    const QUERY = `SELECT * FROM ${TABLE}`;

    const result = pool.query(QUERY);

    return result.rows;
};

export const getATasksFromTable = (id, orderBy, limit, offset) => {
    const ORDERBY = orderBy.upperCase();

    if (!VALID_ORDERBY.includes(ORDERBY)) {
        throw new Error(`Invalid order direction: "${orderBy}". Must be "ASC" or "DESC".`);
    }

    const QUERY = `SELECT * FROM ${TABLE} 
                   WHERE id = $1 
                   ORDER BY title ${ORDERBY} 
                   LIMIT $2 OFFSET $3`
        ;

    const result = pool.query(QUERY, [id, limit, offset]);

    return result.rows;
};

