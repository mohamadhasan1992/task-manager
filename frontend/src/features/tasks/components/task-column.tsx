import { TaskStatusEnum } from "@/enums/task-status.enum";
import { Task } from "@/types/api";
import { TaskItem } from "./task-item";

type TaskColumnProps = {
  title: string;
  status: TaskStatusEnum;
  tasks: Task[];
  onTaskPrefetch?: (id: string) => void;
};

export const TaskColumn = ({ title, status, tasks, onTaskPrefetch }: TaskColumnProps) => {
  const filteredTasks = tasks.filter(task => task.status === status);
  
  return (
    <div className="flex-1 bg-card rounded-lg p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">{title}</h3>
        <span className="text-sm text-gray-500">{filteredTasks.length} tasks</span>
      </div>
      
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onTaskPrefetch={onTaskPrefetch}
           />
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No {title.toLowerCase()} tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};


