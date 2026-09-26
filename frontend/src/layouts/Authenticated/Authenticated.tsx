import { Navigate } from 'react-router';
import { HomeTemplate } from '../HomeTemplate/HomeTemplate';
import { useGetProfileQuery } from '../../stores/service/authApi';

export const Authenticated = () => {
  const { data: user, isLoading, isError } = useGetProfileQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || isError) {
    return <Navigate to='/login' replace />;
  }

  return <HomeTemplate />;
};
