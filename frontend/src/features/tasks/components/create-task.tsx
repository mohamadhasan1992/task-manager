import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { createTaskInputSchema, useCreateTask } from '../api/create-task';


export const CreateTask = () => {
  const { addNotification } = useNotifications();
  const createTaskMutation = useCreateTask({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Tas Created',
        });
      },
    },
  });

  return (
      <FormDrawer
        isDone={createTaskMutation.isSuccess}
        triggerButton={
          <Button size="sm" icon={<Plus className="size-4" />}>
            Create Task
          </Button>
        }
        title="Create Task"
        submitButton={
          <Button
            form="create-task"
            type="submit"
            size="sm"
            isLoading={createTaskMutation.isPending}
          >
            Submit
          </Button>
        }
      >
        <Form
          id="create-task"
          onSubmit={(values) => {
            createTaskMutation.mutate({ data: values });
          }}
          schema={createTaskInputSchema}
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
