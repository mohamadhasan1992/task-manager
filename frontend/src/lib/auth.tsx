import { configureAuth } from 'react-query-auth';
import { Navigate, useLocation } from 'react-router';
import { z } from 'zod';

import { paths } from '@/config/paths';
import { AuthResponse } from '@/types/api';
import { api } from './api-client';



const getUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // Return null, don't throw
    }
    throw error;
  }
};

const logout = async(): Promise<void> => {
  const response = await api.post('/auth/logout');
  return response.data
};

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(5, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = async(data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data
};

export const registerInputSchema = z
  .object({
    email: z.string().min(1, 'Required'),
    password: z.string().min(5, 'Required'),
  });

export type RegisterInput = z.infer<typeof registerInputSchema>;

const registerWithEmailAndPassword = async(
  data: RegisterInput,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/signup', data);
  return response.data
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    const response = await loginWithEmailAndPassword(data);
    return response.data;
  },
  registerFn: async (data: RegisterInput) => {
    const response = await registerWithEmailAndPassword(data);
    return response.data;
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();

  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};
