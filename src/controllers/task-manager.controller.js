import {
    deleteTaskFromService,
    getAllTasksFromService,
    getTaskByIdFromService,
    insertTaskFromService,
    updateTaskFromService
} from "../services/task-manager.service.js"

export const getAllTasks = async (req, res) => {
    try {
        const { orderBy, sortBy, limit, offset } = req.body;

        const data = await getAllTasksFromService(orderBy, sortBy, limit, offset);

        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error!' + error.message
        })
    }
};

export const getAllTasksById = async (req, res) => {
    const id = req.params;

    try {
        if (!id) {
            res.status(400).json({ message: "Invalid Id" });
            return;
        };

        const data = await getTaskByIdFromService(id);

        res.status(200).json({ data })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error!' + error.message
        });
    }
};

export const deleteTask = async (req, res) => {
    const id = req.params;

    try {
        if (!id) {
            res.status(400).json({ message: "Invalid Id" });
            return;
        };

        const data = await deleteTaskFromService(id);

        if (data) {
            res.status(200).json({ success: true });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error!' + error.message
        });
    }
};

export const updateTask = async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title) {
        res.status(400).json({ message: 'title is  required!' });
        return;
    }
    try {
        const data = await updateTaskFromService(title, description, status, priority, dueDate);

        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error!' + error.message
        });
    }
};

export const addTask = async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title) {
        res.status(400).json({ message: 'title is  required!' });
        return;
    }
    try {
        const data = await insertTaskFromService(title, description, status, priority, dueDate);

        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error!' + error.message
        });
    }
};