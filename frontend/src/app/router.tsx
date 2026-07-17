import { createBrowserRouter, RouterProvider } from 'react-router';
import { DcfPage } from '../features/dcf/DcfPage';
import { HomeTemplate } from '../layouts/HomeTemplate/HomeTemplate';
import { DashboardPage } from '../features/dashboard/DashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeTemplate />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dcf',
        element: <DcfPage />,
      },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
