import express from 'express';
import { routes } from './routes/task-manager.routes.js';
import { app_env } from './config/env.js';

const app = express();

app.use(express.json());
app.use('/api', routes);

app.listen(app_env.port, () => console.log('SERVER UP!'));