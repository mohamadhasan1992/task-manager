import { Pen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';

import {
  updateTaskInputSchema,
  useUpdateTask,
} from '../api/update-task';
import { useTask } from '../api/get-task';



type UpdateTaskProps = {
  taskId: string;
};

export const UpdateTask = ({ taskId }: UpdateTaskProps) => {
  const { addNotification } = useNotifications();
  const taskQuery = useTask({ taskId });
  const updateTaskMutation = useUpdateTask({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Task Updated',
        });
        taskQuery.refetch();
      },
    },
  });

  const task = taskQuery.data;

  return (
      <FormDrawer
        isDone={updateTaskMutation.isSuccess}
        triggerButton={
          <Button icon={<Pen className="size-4" />} size="sm">
            Update Task
          </Button>
        }
        title="Update Task"
        submitButton={
          <Button
            form="update-task"
            type="submit"
            size="sm"
            isLoading={updateTaskMutation.isPending}
          >
            Submit
          </Button>
        }
      >
        <Form
          id="update-task"
          onSubmit={(values) => {
            updateTaskMutation.mutate({
              data: values,
              taskId,
            });
          }}
          options={{
            defaultValues: {
              title: task?.title ?? '',
              description: task?.description ?? '',
              status: task?.status ?? '',
            },
          }}
          schema={updateTaskInputSchema}
        >
          {({ register, formState }) => (
            <>
              <Input
                label="Title"
                error={formState.errors['title']}
                registration={register('title')}
              />
              <Textarea
                label="Description"
                error={formState.errors['description']}
                registration={register('description')}
              />

            </>
          )}
        </Form>
      </FormDrawer>
  );
};
