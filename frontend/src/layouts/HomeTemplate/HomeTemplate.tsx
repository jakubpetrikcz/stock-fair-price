import { Outlet } from 'react-router';
import { Sidebar } from '../../components/Sidebar/Sidebar';

export const HomeTemplate = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='w-full overflow-auto'>
        <Outlet />
      </main>
    </div>
  );
};
