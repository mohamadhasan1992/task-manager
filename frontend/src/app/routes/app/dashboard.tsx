import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/lib/auth';



const DashboardRoute = () => {
  const user = useUser();
  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xl">
        Welcome <b>{`${user.data?.email}`}</b>
      </h1>
      <p className="font-medium">In this application you can:</p>
      <ul className="my-4 list-inside list-disc">
        <li>Create task</li>
        <li>Edit task</li>
        <li>Delete task</li>
      </ul>
    </ContentLayout>
  );
};

export default DashboardRoute;
