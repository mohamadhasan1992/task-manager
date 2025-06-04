import { CreateAuthenticatedTaskDto, CreateTaskDto } from '@/dtos/tasks.dto';
import { PaginatedResult } from '@/interfaces/database.interface';
import { ITaskDocument } from '@/models/tasks.model';
import { TaskRepository } from '@/respositories/task.repository';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { FilterQuery } from 'mongoose';
import taskSeederData from "../seeder/tasks.json"
import { TaskStatusEnum } from '@/enum/task-status.enum';


class TasksService {
  private taskRepository: TaskRepository;
  
    constructor() {
      this.taskRepository = new TaskRepository();
    }

  public async findAll(filterQuery: FilterQuery<ITaskDocument>): Promise<PaginatedResult<ITaskDocument>> {
    return await this.taskRepository.findWithPagination(filterQuery);
  }

  public async findOne(filterQuery: FilterQuery<ITaskDocument>): Promise<ITaskDocument> {
    const findTask = await this.taskRepository.findOne(filterQuery);
    if (!findTask) throw new HttpException(409, "Task doesn't exist");

    return findTask;
  }

  public async findById(taskId: string): Promise<ITaskDocument> {
    if (isEmpty(taskId)) throw new HttpException(400, "taskId is empty");

    const findTask = await this.taskRepository.findOne({ _id: taskId });
    if (!findTask) throw new HttpException(409, "Task doesn't exist");

    return findTask;
  }

  public async create(taskData: CreateAuthenticatedTaskDto): Promise<ITaskDocument> {
    if (isEmpty(taskData)) throw new HttpException(400, "taskData is empty");

    const createTaskData = await this.taskRepository.create(taskData);

    return createTaskData;
  }

  public async createMany(userId: string){
    const tasks = taskSeederData.taskList;

    const tasksWithUser = tasks.map(task => ({
      ...task,
      status: task.status as unknown as TaskStatusEnum,
      user: userId,
    }));

    return await this.taskRepository.createMany(tasksWithUser);
  } 

  public async update(filterQuery: FilterQuery<ITaskDocument>, taskData: Partial<CreateTaskDto>): Promise<ITaskDocument> {
    if (isEmpty(taskData)) throw new HttpException(400, "taskData is empty");
    const updateTask = await this.taskRepository.updateOne(filterQuery, taskData);
    if (!updateTask) throw new HttpException(409, "Task doesn't exist");

    return updateTask;
  }

  public async updateByOwner(taskId: string, userId: string, taskData: Partial<CreateTaskDto>): Promise<ITaskDocument> {
    if (isEmpty(taskData)) throw new HttpException(400, "taskData is empty");
    const taskToUpdated = await this.taskRepository.findOne({_id: taskId, user: userId})
    if(!taskToUpdated){
      throw new HttpException(404, "task is not yours");
    }
    const updateTask = await this.taskRepository.updateById(taskId, taskData);
    if (!updateTask) throw new HttpException(409, "Task doesn't exist");

    return await this.taskRepository.findById(taskId);
  }

  public async delete(filterQuery: FilterQuery<ITaskDocument>): Promise<ITaskDocument> {
    const deleteTaskById = await this.taskRepository.deleteOne(filterQuery);
    if (!deleteTaskById) throw new HttpException(409, "Task doesn't exist");

    return deleteTaskById;
  }
}

export default TasksService;
