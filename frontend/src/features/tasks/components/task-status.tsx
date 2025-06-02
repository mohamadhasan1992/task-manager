import { TaskStatusEnum } from "@/enums/task-status.enum";






export const TaskStatus = ({status}: {status: TaskStatusEnum}) => {
    return (
        <span
            className={`ml-4 rounded px-2 py-1 text-xs font-semibold ${
            status === 'done'
                ? 'bg-green-100 text-green-800'
                : status === 'in-progress'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
        >
            {status.replace('-', ' ').toUpperCase()}
        </span>
    )
}