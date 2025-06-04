import { NextFunction, Response } from 'express';
import TasksService from '@/services/task.service';
import { CreateTaskDto } from '@/dtos/tasks.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';



class TasksController {
  public taskService = new TasksService();

  public getTasks = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user= req.user;
      const query = req.query
      const findAllTasksData = await this.taskService.findAll({
        ...query,
        user: user._id, 
        populate: {
          path: "user",
          model: "User",
          select: "email"
        },
        sort: {"createdAt": -1}
      });

      res.status(200).json(findAllTasksData);
    } catch (error) {
      next(error);
    }
  };

  public getTaskById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user= req.user
      const taskId: string = req.params.id;
      const findOneTaskData = await this.taskService.findOne({
        _id: taskId, 
        user: user._id,
        populate: {
          path: "user",
          model: "User",
          select: "email"
        }
      });

      res.status(200).json(findOneTaskData);
    } catch (error) {
      next(error);
    }
  };

  public createManyTasks = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try{
      const user = req.user;
      await this.taskService.createMany(user._id.toString())
      res.status(201).json({ data: {}, message: 'Many tasks created successfully!' });
    }catch(err){
      next(err)
    }
  }

  public createTask = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user= req.user
      const taskData: CreateTaskDto = req.body;
      const createTaskData = await this.taskService.create({...taskData, user: user._id});

      res.status(201).json({ data: createTaskData, message: 'created successfully!' });
    } catch (error) {
      next(error);
    }
  };

  public updateTask = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user= req.user
      const taskId: string = req.params.id;
      const updateTaskDto: Partial<CreateTaskDto> = req.body;
      const updateTaskData = await this.taskService.updateByOwner(taskId, user._id, updateTaskDto);

      res.status(200).json({ data: updateTaskData, message: 'updated successfully!' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTask = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user= req.user;
      const taskId: string = req.params.id;
      const deletedTask = await this.taskService.delete({_id:taskId, user: user._id});

      res.status(200).json({ data: deletedTask, message: 'deleted successfully!' });
    } catch (error) {
      next(error);
    }
  };
}

export default TasksController;
