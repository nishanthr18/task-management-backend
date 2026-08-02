import { Router } from "express";
import {
    getAllTasks,
    getAllTasksById,
    deleteTask,
    updateTask,
    addTask
} from "../controllers/task-manager.controller.js";

export const routes = Router();

routes.get('/tasks', getAllTasks);
routes.get('/tasks/task/:id', getAllTasksById);
routes.delete('/tasks/task/:id', deleteTask);
routes.put('/task', updateTask);
routes.post('/task', addTask);