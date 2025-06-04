import { Task } from "@/types/api";
import { formatDate } from "@/utils/format";
import { useQueryClient } from "@tanstack/react-query";
import { TaskStatus } from "./task-status";
import { getTaskQueryOptions } from "../api/get-task";
import { paths } from "@/config/paths";
import { Button } from "@/components/ui/button";
import { SquareChevronLeft, SquareChevronRight } from "lucide-react";
import { TaskStatusEnum } from "@/enums/task-status.enum";
import { useUpdateTask } from "../api/update-task";
import { useNotifications } from "@/components/ui/notifications";
import { Tooltip } from "@/components/ui/tooltip";




export const TaskItem = ({
    task,
    onTaskPrefetch,
}: {
    task: Task;
    onTaskPrefetch?: (id: string) => void;
}) => {
    const { addNotification } = useNotifications();
    const queryClient = useQueryClient();
    const updateTaskMutation = useUpdateTask({
        mutationConfig: {
          onSuccess: () => {
            addNotification({
              type: 'success',
              title: 'Task Updated',
            });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries(getTaskQueryOptions(task._id));
          },
        },
      });

    const handleCardClick = () => {
        queryClient.prefetchQuery(getTaskQueryOptions(task._id));
        onTaskPrefetch?.(task._id);
        window.location.href = paths.home.task.getHref(task._id);
    };

    const handleProgressRightClick = () => {
        updateTaskMutation.mutate({
            data: {
                status: task.status == TaskStatusEnum.Pending ? TaskStatusEnum.InProgress : TaskStatusEnum.Done
            },
            taskId: task._id,
        });

    }
    const handleProgressLeftClick = () => {
        updateTaskMutation.mutate({
            data: {
                status: task.status == TaskStatusEnum.Done ? TaskStatusEnum.InProgress : TaskStatusEnum.Pending
            },
            taskId: task._id,
        });
    }

    return (
        <Tooltip text="For more detail click on the title ">
            <div
                key={task._id}
                className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
                <div 
                    className="flex flex-col cursor-pointer"
                    onClick={handleCardClick}
                    tabIndex={0}
                    role="button"
                    onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") handleCardClick();
                    }}
                    >
                    <div 
                        className="flex justify-between mb-3">
                    <h4 className="font-medium text-gray-900 mb-2">
                        {task.title}
                        <span className="text-xs text-gray-400 ml-2">
                            {formatDate(task.createdAt)}
                        </span>
                    </h4>
                    <TaskStatus status={task.status} />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{task.user?.email}</span>
                </div>
                </div>
                
                
                <hr className="my-3 border-t border-gray-200" />
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{task.description}</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <Tooltip text="Progress the task">
                    <Button
                        variant="ghost"
                        disabled={task.status == TaskStatusEnum.Pending}
                        size="sm"
                        onClick={handleProgressLeftClick}
                    >
                        <SquareChevronLeft className="size-5" />
                    </Button>
                    </Tooltip>
                    <Tooltip text="Revert Task">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={task.status == TaskStatusEnum.Done}
                            onClick={handleProgressRightClick}
                        >
                            <SquareChevronRight className="size-5" />
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </Tooltip>
    );
};