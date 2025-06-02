import { Task } from "@/types/api";
import { formatDate } from "@/utils/format";
import { useQueryClient } from "@tanstack/react-query";
import { TaskStatus } from "./task-status";
import { getTaskQueryOptions } from "../api/get-task";
import { paths } from "@/config/paths";
import { Button } from "@/components/ui/button";
import { LogIn, SquareChevronLeft, SquareChevronRight } from "lucide-react";
import { TaskStatusEnum } from "@/enums/task-status.enum";
import { useUpdateTask } from "../api/update-task";
import { useNotifications } from "@/components/ui/notifications";




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
        window.location.href = paths.app.task.getHref(task._id);
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
        <div
            key={task._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
            <div 
                onClick={handleCardClick}
                tabIndex={0}
                role="button"
                onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") handleCardClick();
                }}
                className="flex justify-between mb-3 cursor-pointer">
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
            <hr className="my-3 border-t border-gray-200" />
            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{task.description}</span>
            </div>
            <div className="flex justify-between items-center mt-4">
                <Button
                    variant="destructive"
                    disabled={task.status == TaskStatusEnum.Pending}
                    size="sm"
                    onClick={handleProgressLeftClick}
                >
                    <SquareChevronLeft className="size-4" />
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    disabled={task.status == TaskStatusEnum.Done}
                    onClick={handleProgressRightClick}
                >
                    <SquareChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
};