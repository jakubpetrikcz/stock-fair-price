import { createBrowserRouter, RouterProvider } from 'react-router';
import { DcfPage } from '../features/dcf/DcfPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { FavoritesPage } from '../features/favorites/FavoritesPage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { Authenticated } from '../layouts/Authenticated/Authenticated';
import { Unauthenticated } from '../layouts/Unauthenticated/Unauthenticated';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Authenticated />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dcf',
        element: <DcfPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
    ],
  },
  {
    element: <Unauthenticated />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
