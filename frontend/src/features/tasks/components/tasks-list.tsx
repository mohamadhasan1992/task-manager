import { TaskStatusEnum } from '@/enums/task-status.enum';
import { TaskColumn } from './task-column';

export type TasksListProps = {
  onTaskPrefetch?: (id: string) => void;
};


export const TasksList = ({ onTaskPrefetch }: TasksListProps) => {
  
  return (
    <div className="w-full">
      <div className="flex gap-6 min-h-[600px]">
        <TaskColumn
          title="Pending"
          status={TaskStatusEnum.Pending}
          onTaskPrefetch={onTaskPrefetch}
        />
        
        <TaskColumn
          title="In Progress"
          status={TaskStatusEnum.InProgress}
          onTaskPrefetch={onTaskPrefetch}
        />
        
        <TaskColumn
          title="Done"
          status={TaskStatusEnum.Done}
          onTaskPrefetch={onTaskPrefetch}
        />
      </div>
    </div>
  );
};