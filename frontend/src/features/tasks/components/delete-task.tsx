import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { useDeleteTask } from '../api/delete-task';
import { useNavigate } from 'react-router';

type DeleteTaskProps = {
  id: string;
};

export const DeleteTask = ({ id }: DeleteTaskProps) => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const deleteTaskMutation = useDeleteTask({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Task Deleted',
        });
        
        navigate(-1);
      },
    },
  });

  return (
      <ConfirmationDialog
        icon="danger"
        title="Delete Task"
        body="Are you sure you want to delete this task?"
        triggerButton={
          <Button 
            variant="destructive" 
            icon={<Trash className="size-4" />}
            size="sm"
            >
            Delete Task
          </Button>
        }
        confirmButton={
          <Button
            isLoading={deleteTaskMutation.isPending}
            type="button"
            variant="destructive"
            onClick={() =>
              deleteTaskMutation.mutate({ taskId: id })
            }
          >
            Delete Task
          </Button>
        }
      />
  );
};
