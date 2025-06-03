import { useNavigate, useSearchParams } from 'react-router';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { paths } from '@/config/paths';
import { RegisterForm } from '@/features/auth/components/register-form';

const RegisterRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');


  return (
    <AuthLayout title="Register your account">
      <RegisterForm
        onSuccess={() => {
          navigate(
            `${redirectTo ? `${redirectTo}` : paths.home.dashboard.getHref()}`,
            {
              replace: true,
            },
          );
        }}
      />
    </AuthLayout>
  );
};

export default RegisterRoute;
