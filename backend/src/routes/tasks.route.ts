import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import TasksController from '@/controllers/taks.controller';
import { CreateTaskDto } from '@/dtos/tasks.dto';
import authMiddleware from '@/middlewares/auth.middleware';

class TasksRoute implements Routes {
  public path = '/tasks';
  public router = Router();
  public takssController = new TasksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.takssController.getTasks);
    this.router.post(`${this.path}/many-tasks`, authMiddleware, this.takssController.createManyTasks);
    this.router.get(`${this.path}/:id`, authMiddleware, this.takssController.getTaskById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateTaskDto, 'body'), this.takssController.createTask);
    this.router.patch(`${this.path}/:id`, authMiddleware, validationMiddleware(CreateTaskDto, 'body', true), this.takssController.updateTask);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.takssController.deleteTask);
  }
}

export default TasksRoute;
