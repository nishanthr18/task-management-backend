import {
    deleteFromTable,
    getATasksFromTable,
    getTaskByIdFromTable,
    insertValuesToTable,
    updateValuesToTable
} from "../repositories/task-manager.repository.js";

const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const VALID_ORDERBY = ['ASC', 'DESC'];
const ALLOWED_SORT_FIELDS = ['title', 'priority', 'created_at', 'due_date'];

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

export const getAllTasks = async (orderBy = 'ASC', sortBy = 'title', limit = 10, offset = 0) => {
    try {
        const ORDER_BY = orderBy.upperCase();
        const SORT_BY = sortBy.toLowerCase();

        if (!VALID_ORDERBY.includes(ORDER_BY)) {
            throw new Error(`Invalid order direction: "${orderBy}". Must be "ASC" or "DESC".`);
        };

        if (!ALLOWED_SORT_FIELDS.includes(SORT_BY)) {
            throw new Error(`Invalid sort column: "${sortBy}". Must be one of: ${ALLOWED_SORT_FIELDS.join(', ')}`);
        }

        return (await getATasksFromTable(ORDER_BY, SORT_BY, limit, offset));
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getTaskById = async (id) => {
    if (!id) {
        throw new Error('Id is required');
    };

    try {
        return (await getTaskByIdFromTable(id));

    } catch (error) {
        throw new Error(error.message)
    }
};

export const deleteTask = async (id) => {
    if (!id) {
        throw new Error('Id is required');
    }

    try {
        return (await deleteFromTable(id));
    } catch (error) {
        throw new Error('something went wrong')
    }
};

export const updateTask = async (title, description, status, priority, dueDate) => {
    try {
        const { STATUS, PRIORITY } = validate(status, priority);
        return (await updateValuesToTable(title, description, STATUS, PRIORITY, dueDate));
    } catch (error) {
        throw new Error(error.message)
    }
};

export const insertTask = async (title, description, status, priority, dueDate) => {
    try {
        const { STATUS, PRIORITY } = validate(status, priority);

        return (await insertValuesToTable(title, description, status, priority, dueDate));
    } catch (error) {
        throw new Error(error.message)
    }
}