import { Navigate, Outlet } from 'react-router';
import { useGetProfileQuery } from '../../stores/service/authApi';

export const Unauthenticated = () => {
  const { data: user, isLoading, isError } = useGetProfileQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || isError) {
    return <Outlet />;
  }

  return <Navigate to='/' replace />;
};
