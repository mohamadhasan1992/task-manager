import { TaskStatusEnum } from '@/enum/task-status.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class CreateTaskDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status: TaskStatusEnum
}

export class CreateAuthenticatedTaskDto extends CreateTaskDto {
  @IsString()
  public user: string;
}


export class UpdateTaskStatusDto{
    @IsEnum(TaskStatusEnum)
    @IsNotEmpty()
    status: TaskStatusEnum
}